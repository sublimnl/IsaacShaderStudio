declare namespace AceAjax {
    export interface Editor {
        getValue(): string;
        setValue(value: string, cursorPos?: number): void;
        getSession(): EditSession;
        setTheme(theme: string): void;
        setFontSize(size: number | string): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOption(name: string, value: any): void;
        resize(force?: boolean): void;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        on(event: string, callback: Function): void;
    }

    export interface EditSession {
        setMode(mode: string): void;
        setAnnotations(annotations: Annotation[]): void;
        clearAnnotations(): void;
        addMarker(range: Range, className: string, type: string, inFront?: boolean): number;
        removeMarker(markerId: number): void;
    }

    export interface Annotation {
        row: number;
        column: number;
        text: string;
        type: 'error' | 'warning' | 'info';
    }

    export interface Range {
        start: { row: number; column: number };
        end: { row: number; column: number };
    }

    export function edit(element: string | HTMLElement): Editor;
}

declare const ace: typeof AceAjax;
