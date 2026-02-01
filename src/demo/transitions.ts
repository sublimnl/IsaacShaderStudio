import { Abstract, Canvas } from "./imports";

export class Transition {
    static CrossFade(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const fadePercent = current * 100 / frames;
        if (fadePercent > 100) return false;

        Canvas.context.save();
        Canvas.context.globalAlpha = 1 - fadePercent / 100;
        from.Render();
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.globalAlpha = fadePercent / 100;
        to.Update(delta);
        to.Render();
        Canvas.context.restore();

        return true;
    }

    static MoveRight(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const shift = (Canvas.width / frames) * current;
        if (frames === current) return false;

        Canvas.context.save();
        Canvas.context.imageSmoothingEnabled = true;
        Canvas.context.translate(-shift, 0);
        from.Render();
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.translate(Canvas.width + -shift, 0);
        to.Update(delta);
        to.Render();
        Canvas.context.imageSmoothingEnabled = false;
        Canvas.context.restore();

        return true;
    }

    static MoveLeft(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const shift = (Canvas.width / frames) * current;
        if (frames === current) return false;

        Canvas.context.save();
        Canvas.context.translate(shift, 0);
        from.Render();
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.translate(-Canvas.width + shift, 0);
        to.Update(delta);
        to.Render();
        Canvas.context.restore();

        return true;
    }

    static MoveDown(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const shift = (Canvas.height / frames) * current;
        if (frames === current) return false;

        Canvas.context.save();
        Canvas.context.translate(0, -shift);
        from.Render();
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.translate(0, Canvas.height + -shift);
        to.Update(delta);
        to.Render();
        Canvas.context.restore();

        return true;
    }

    static MoveUp(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const shift = (Canvas.height / frames) * current;
        if (frames === current) return false;

        Canvas.context.save();
        Canvas.context.translate(0, shift);
        from.Render();
        Canvas.context.restore();

        Canvas.context.save();
        Canvas.context.translate(0, -Canvas.height + shift);
        to.Update(delta);
        to.Render();
        Canvas.context.restore();

        return true;
    }

    static IrisIn(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        let radius = current + delta - 1;
        radius = radius * radius * 0.6;

        if (radius > Canvas.width) {
            return false;
        }

        to.Update(delta);
        to.Render();

        Canvas.context.beginPath();
        Canvas.context.moveTo(Canvas.width / 2, Canvas.height / 2);
        Canvas.context.arc(Canvas.width / 2, Canvas.height / 2, radius, 0, Math.PI * 2, true);
        Canvas.context.closePath();
        Canvas.context.clip();

        from.Render();

        return true;
    }

    static IrisOut(from: Abstract.Scene, to: Abstract.Scene, frames: number, current: number, delta: number): boolean {
        const radius = (Canvas.width / 2) - (current * 10);
        if (radius <= 0) return false;

        to.Update(delta);
        to.Render();

        Canvas.context.beginPath();
        Canvas.context.moveTo(Canvas.width / 2, Canvas.height / 2);
        Canvas.context.arc(Canvas.width / 2, Canvas.height / 2, radius, 0, Math.PI * 2, true);
        Canvas.context.closePath();
        Canvas.context.clip();

        from.Render();

        return true;
    }
}
