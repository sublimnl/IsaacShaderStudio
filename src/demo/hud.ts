import { Abstract, Canvas, Clamp, Game, Media, Vector } from "./imports";

export class HUD extends Abstract.Entity {
	private fontOpacity: number = 1;

	constructor() {
		super()
	}

	public Update(_delta: number): void {

	}

	public Render() {

		Media.draw("d6", 0, 0, 32, 32, 10, 25, 32, 32)

		// Empty
		Media.draw("ui_chargebar", 0, 0, 16, 32, 36, 25, 16, 32)
		Media.draw("ui_chargebar", 16, 0, 16, 32, 36, 25, 16, 32)
		Media.draw("ui_chargebar", 48, 0, 16, 32, 36, 25, 16, 32)

		this.RenderHearts();
		this.RenderConsumables();
		this.RenderStats();
	}

	private RenderHearts(): void {
		const hearts = Game.GetPlayer().GetHearts();
		const max = Game.GetPlayer().GetMaxHearts();

		let xOffset = 46;
		let yOffset = 28;
		for (let i = 1; i <= Clamp(max, 0, 12); i++) {
			Media.draw("ui_hearts", 32, 0, 16, 16, xOffset, yOffset, 16, 16);
			if (i <= hearts) {
				Media.draw("ui_hearts", 0, 0, 16, 16, xOffset, yOffset, 16, 16)
			} else if (i - hearts === 0.5) {
				Media.draw("ui_hearts", 16, 0, 16, 16, xOffset, yOffset, 16, 16)
			}
			xOffset += 12;
			if (i === 6) {
				xOffset = 62;
				yOffset += 10;
			}
		}
	}

	private RenderConsumables(): void {
		// Coins
		const coins = String(Game.GetPlayer().GetCoins()).padStart(2, '0');
		Media.draw("hudpickups", 0, 0, 16, 16, 6, 52, 16, 16);
		Media.getFont("pftempestasevencondensed").write(coins, new Vector(20, 52), -7);

		// Bombs
		const bombs = String(Game.GetPlayer().GetBombs()).padStart(2, '0');
		Media.draw("hudpickups", 0, 16, 16, 16, 6, 64, 16, 16);
		Media.getFont("pftempestasevencondensed").write(bombs, new Vector(20, 64), -7);

		// Keys
		const keys = String(Game.GetPlayer().GetKeys()).padStart(2, '0');
		Media.draw("hudpickups", 16, 0, 16, 16, 6, 76, 16, 16)
		Media.getFont("pftempestasevencondensed").write(keys, new Vector(20, 76), -7);
	}

	private RenderStats(): void {
		Canvas.context.save();
		Canvas.context.globalAlpha = 0.6;

		Media.draw("hudstats", 16, 0, 16, 16, 6, 95, 16, 16);
		Media.getFont("luaminioutlined").write("1.00", new Vector(21, 94), -1);

		Media.draw("hudstats", 32, 0, 16, 16, 6, 108, 16, 16);
		Media.getFont("luaminioutlined").write("2.73", new Vector(21, 107), -1);

		Media.draw("hudstats", 0, 0, 16, 16, 6, 121, 16, 16);
		Media.getFont("luaminioutlined").write("3.50", new Vector(21, 120), -1);

		Media.draw("hudstats", 0, 16, 16, 16, 6, 134, 16, 16);
		Media.getFont("luaminioutlined").write("6.50", new Vector(21, 133), -1);

		Media.draw("hudstats", 16, 16, 16, 16, 6, 147, 16, 16);
		Media.getFont("luaminioutlined").write("1.00", new Vector(21, 146), -1);

		Media.draw("hudstats", 32, 16, 16, 16, 6, 160, 16, 16);
		Media.getFont("luaminioutlined").write("0.00", new Vector(21, 159), -1);

		Media.draw("hudstats", 48, 0, 16, 16, 6, 173, 16, 16);
		Media.getFont("luaminioutlined").write("0.0%", new Vector(21, 172), -1);

		Media.draw("hudstats", 48, 16, 16, 16, 6, 186, 16, 16);
		Media.getFont("luaminioutlined").write("0.0%", new Vector(21, 185), -1);


		Canvas.context.restore();

	}

	public GetRenderOrder(): number {
		return Infinity;
	}
}