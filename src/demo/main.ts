import { Abstract, Asset, Canvas, fitRectIntoContainer, Font, Game, Input, Media, Scene, SceneManager, ShaderStudio, Timer, Type } from "./imports";
import * as version from "./build.json";

const { Studio } = ShaderStudio;

export class WebBOI {
	private initialized: boolean = false;

	constructor() {
		Canvas.initialize(document.getElementById("gameCanvas") || document.querySelector("canvas"), 286, 442)

		this.PreloadAssets();

		Timer.start();

		document.addEventListener("tick", (event: Type.TickEvent) => {
			this.Update(event);
			this.Render(event);
		});
	}

	private PreloadAssets() {
		Media.Preload(Asset.AnimationAssets, Asset.FontAssets, Asset.ImageAssets);

		const loader = document.querySelector(".loader");
		const progress = loader?.querySelector("progress") as HTMLProgressElement | null;
		loader?.removeAttribute("hidden");

		document.addEventListener("loadingEvent", ((e: Type.LoadingEvent) => {
			// Update progress bar if it exists (old UI)
			if (progress) {
				progress.value = e.detail.progress;
			}

			if (e.detail.progress >= 100 && !this.initialized) {
				loader?.setAttribute("hidden", "true");
				this.Start();
				loader?.classList.add("fade-out");
				this.initialized = true;
			}
		}) as EventListener);
	}

	private Start() {
		// Skip title screen and go directly to game loading
		SceneManager.ChangeScene(new Scene.LoadScreen());

		// Initialize Shader Studio after game is ready
		Studio.initialize();
	}

	private Update(event: Type.TickEvent) {
		SceneManager.Update(event)
	}

	private Render(event: Type.TickEvent) {
		Canvas.Clear();
		SceneManager.Render();
		Canvas.Render();

		// Update shader studio with game data
		if (Studio.isInitialized()) {
			const player = Game.GetPlayer();
			const playerX = player?.Position?.x ?? Canvas.width / 2;
			const playerY = player?.Position?.y ?? Canvas.height / 2;

			// Collect tear positions (player tears only, up to 10)
			const tearPositions: { x: number; y: number }[] = [];
			const room = Game.GetLevel()?.GetRoom();
			if (room) {
				const entities = room.GetEntities();
				for (const entity of entities) {
					if (tearPositions.length >= 10) break;
					if (entity instanceof Abstract.EntityTear) {
						// Get tear's screen position (accounting for Height for visual position)
						const tearHeight = (entity as any).Height ?? 0;
						tearPositions.push({
							x: entity.Position.x,
							y: entity.Position.y + tearHeight
						});
					}
				}
			}

			Studio.updateFromGame(
				Canvas.getBufferCanvas(),
				playerX,
				playerY,
				Canvas.width,
				Canvas.height,
				tearPositions
			);
		}
	}
}

const fitToWindow = () => {
	// Fit the GL canvas to the viewport
	const glCanvas = document.getElementById('glCanvas') as HTMLCanvasElement;
	const viewport = document.querySelector('.viewport') as HTMLElement;

	if (glCanvas && viewport) {
		const viewportRect = viewport.getBoundingClientRect();
		const canvasSize = fitRectIntoContainer(glCanvas.width, glCanvas.height, viewportRect.width - 20, viewportRect.height - 20);
		glCanvas.style.width = `${canvasSize.width}px`;
		glCanvas.style.height = `${canvasSize.height}px`;
	}
}

declare global {
    interface Window {
        TBOI: WebBOI;
    }
}

// Only auto-initialize if not in React mode (check for React root)
if (!document.getElementById('root')?.hasChildNodes()) {
	window.onload = () => {
		window.TBOI = new WebBOI();
		fitToWindow();

		// Use ResizeObserver to detect viewport size changes from layout updates
		const viewport = document.querySelector('.viewport') as HTMLElement;
		if (viewport) {
			let resizeTimeout: ReturnType<typeof setTimeout>;
			const resizeObserver = new ResizeObserver(() => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(fitToWindow, 50);
			});
			resizeObserver.observe(viewport);
		}

		const buildInfo = document.getElementById("buildInfo");
		if (buildInfo) {
			buildInfo.innerText = `Build: ${version.buildMajor}.${version.buildMinor}.${version.buildRevision}-${version.buildTag}; Updated: ${new Date(version.timestamp).toLocaleString()}`;
		}
	}
}
