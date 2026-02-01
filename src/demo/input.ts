import { Enum } from "./imports";
import Gamepad from '@maulingmonkey/gamepad/modular';


const KeyMapping: { [action: number]: string } = {
    [Enum.Action.WALK_UP]: "KeyW",
    [Enum.Action.WALK_DOWN]: "KeyS",
    [Enum.Action.WALK_LEFT]: "KeyA",
    [Enum.Action.WALK_RIGHT]: "KeyD",
    [Enum.Action.SHOOT_UP]: "ArrowUp",
    [Enum.Action.SHOOT_DOWN]: "ArrowDown",
    [Enum.Action.SHOOT_LEFT]: "ArrowLeft",
    [Enum.Action.SHOOT_RIGHT]: "ArrowRight",
    [Enum.Action.BOMB]: "KeyE",
    [Enum.Action.ITEM]: "Space",
    [Enum.Action.POCKET_ITEM]: "KeyQ",
    [Enum.Action.DROP]: "ControlLeft",
    [Enum.Action.FULLSCREEN]: "KeyF",
    [Enum.Action.RESTART]: "KeyR",
    [Enum.Action.MUTE]: "KeyM",
}

const ReverseKeyMapping: { [code: string]: Enum.Action } = {
    "KeyW": Enum.Action.WALK_UP,
    "KeyS": Enum.Action.WALK_DOWN,
    "KeyA": Enum.Action.WALK_LEFT,
    "KeyD": Enum.Action.WALK_RIGHT,
    "ArrowUp": Enum.Action.SHOOT_UP,
    "ArrowDown": Enum.Action.SHOOT_DOWN,
    "ArrowLeft": Enum.Action.SHOOT_LEFT,
    "ArrowRight": Enum.Action.SHOOT_RIGHT,
    "KeyE": Enum.Action.BOMB,
    "Space": Enum.Action.ITEM,
    "KeyQ": Enum.Action.POCKET_ITEM,
    "ControlLeft": Enum.Action.DROP,
    "KeyF": Enum.Action.FULLSCREEN,
    "KeyR": Enum.Action.RESTART,
    "KeyM": Enum.Action.MUTE,
}

const GamepadButtonMapping: { [button: number ]: Enum.Action } = {
    0: Enum.Action.SHOOT_DOWN,
    1: Enum.Action.SHOOT_RIGHT,
    2: Enum.Action.SHOOT_LEFT,
    3: Enum.Action.SHOOT_UP,
    4: Enum.Action.BOMB,
    5: Enum.Action.POCKET_ITEM,
    6: Enum.Action.ITEM,
    7: Enum.Action.DROP,
    12: Enum.Action.WALK_UP,
    13: Enum.Action.WALK_DOWN,
    14: Enum.Action.WALK_LEFT,
    15: Enum.Action.WALK_RIGHT,
}

const GamepadAxisMapping: { [button: number ]: { [sign: number] : Enum.Action }} = {
    0: {
        [-1]: Enum.Action.WALK_LEFT,
        [1]: Enum.Action.WALK_RIGHT,
    },
    1: {
        [-1]: Enum.Action.WALK_UP,
        [1]: Enum.Action.WALK_DOWN,
    },
    2: {
        [-1]: Enum.Action.SHOOT_LEFT,
        [1]: Enum.Action.SHOOT_RIGHT,
    },
    3: {
        [-1]: Enum.Action.SHOOT_UP,
        [1]: Enum.Action.SHOOT_DOWN,
    }
}

class InputManager {
    private static instance: InputManager;
    private pressed: { [code: string]: boolean } = {};
    private action: { [action: number] : number } = {};
    private toggle: { [action: number] : boolean } = {};
    private hasGamepad: boolean = false;

    private constructor() {
        document.onkeydown = this.keyDownEvent.bind(this);
        document.onkeyup = this.keyUpEvent.bind(this);

        this.pressed = {};

        if (!Gamepad.isSupported()) console.warn("Gamepads not available in this browser");
        const gamepads = Gamepad.getRawGamepads();

        if (gamepads[0]) {
            Gamepad.tryRemapStdLayout(gamepads[0]);
            this.hasGamepad = true;
        }

        // Start gamepad polling manually (the library's auto-start relies on
        // the 'load' event which may have already fired in React apps)
        Gamepad.poll(() => {
            Gamepad.pollEvents();
        });

        window.addEventListener('mmk-gamepad-button-value', (e) => {
            this.hasGamepad = true;
            const event: Gamepad.GamepadButtonEvent = (e as unknown as Gamepad.GamepadButtonEvent);
            const action = GamepadButtonMapping[event.buttonIndex];
            if (action !== undefined) {
                this.action[action] = event.buttonValue;
                if (event.buttonValue) {
                    this.toggle[action] = !this.toggle[action];
                }
            }
        });

        window.addEventListener('mmk-gamepad-axis-value', (e) => {
            this.hasGamepad = true;
            const event: Gamepad.GamepadAxisEvent = (e as unknown as Gamepad.GamepadAxisEvent);
            const axisMapping = GamepadAxisMapping[event.axisIndex];
            if (axisMapping) {
                if (Math.abs(event.axisValue) < 0.2) {
                    this.action[axisMapping[-1]] = 0;
                    this.action[axisMapping[1]] = 0;
                } else {
                    this.action[axisMapping[Math.sign(event.axisValue)]] = event.axisValue;
                }
            }
        });
    }

    public static initalize(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }

        return InputManager.instance;
    }

    public AnyActionPressed(): boolean {
        for (const action in Enum.Action) {
            if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
                return true;
            }
        }

        return false;
    }

    public IsActionPressed(action: Enum.Action): boolean {
        if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
            return true;
        }

        return this.IsKeyDown(KeyMapping[action]);
    }

    public ActionToggleValue(action: Enum.Action): boolean {
        return this.toggle[action];
    }

    public IsActionTriggered(action: Enum.Action): boolean {
        if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
            return true;
        }

        return this.IsKeyPressedOnce(KeyMapping[action]);
    }

    public GetActionValue(action: Enum.Action): number {
        return this.action[action];
    }

    public HasGamepad(): boolean {
        return this.hasGamepad;
    }

    public IsKeyDown(code: string): boolean {
        if (this.pressed[code] !== null) {
            return this.pressed[code];
        }

        return false;
    }

    public IsKeyPressedOnce(code: string): boolean {
        if (this.IsKeyDown(code)) {
            this.pressed[code] = false;
            this.action[ReverseKeyMapping[code]] = 0;
            return true;
        }

        return false;
    }

    private keyDownEvent(event: KeyboardEvent) {
        // Don't capture input if user is in an editor or input field
        if (this.isInEditorOrInput()) {
            return;
        }

        this.pressed[event.code] = true;

        if (ReverseKeyMapping[event.code]) {
            this.action[ReverseKeyMapping[event.code]] = 1;
            this.toggle[ReverseKeyMapping[event.code]] = !this.toggle[ReverseKeyMapping[event.code]];
        }

        this.preventDefault(event);
    }

    private keyUpEvent(event: KeyboardEvent) {
        // Don't capture input if user is in an editor or input field
        if (this.isInEditorOrInput()) {
            return;
        }

        this.pressed[event.code] = false;

        if (ReverseKeyMapping[event.code]) {
            this.action[ReverseKeyMapping[event.code]] = 0;
        }

        this.preventDefault(event);
    }

    private isInEditorOrInput(): boolean {
        const activeElement = document.activeElement;
        if (!activeElement) return false;

        // Check if in a text input, textarea, select, or contenteditable
        const tagName = activeElement.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return true;
        }

        // Check for contenteditable
        if (activeElement.getAttribute('contenteditable') === 'true') {
            return true;
        }

        // Check if inside an Ace editor (they use a textarea inside .ace_editor)
        if (activeElement.closest('.ace_editor')) {
            return true;
        }

        return false;
    }

    private preventDefault(event: KeyboardEvent) {
        if (event.code.startsWith("Arrow") || (event.which >= 112 && event.which <= 123)) {
            event.preventDefault();
        }
    }
}

export const Input = InputManager.initalize();