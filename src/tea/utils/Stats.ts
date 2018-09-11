import * as Tea from "../Tea";

export class Stats {
	app: Tea.App;
	barY: number;
	protected _enabled: boolean;
	protected _canvas: HTMLCanvasElement;
	protected _context: CanvasRenderingContext2D;
	protected _time: number;
	protected _frameCount: number;

	constructor(app: Tea.App) {
		this.app = app;
		this.barY = 14;
		this._enabled = true;
		this._canvas = document.createElement("canvas");
		this._canvas.width = 60;
		this._canvas.height = 36;
		this._canvas.style.pointerEvents = "none";
		this._context = this._canvas.getContext("2d");
		this._context.textAlign = "start";
		this._context.textBaseline = "top";
		this._time = Tea.now();
		this._frameCount = 0;
		this.clearRect();
		this.draw();
	}

	get enabled(): boolean {
		return this._enabled;
	}
	set enabled(value: boolean) {
		if (value === this._enabled) {
			return;
		}
		this._enabled = value;
		if (value) {
			this._canvas.style.display = null;
		} else {
			this._canvas.style.display = "none";
		}
	}

	get canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	update(): void {
		if (this._enabled === false) {
			return;
		}
		this._frameCount++;
		var now = Tea.now();
		if (now - this._time > 1000.0) {
			this._time = now;
			this.draw();
		}
	}

	updateSize(): void {
		var canvas = this.app.canvas;
		var style = this.canvas.style;
		style.position = "absolute";
		style.left = canvas.offsetLeft + canvas.clientWidth - this.canvas.width + "px";
		style.top = canvas.offsetTop + "px";
	}

	protected clearRect(x?: number, y?: number, w?: number, h?: number): void {
		var context = this._context;
		if (w == null) {
			w = this._canvas.width;
		}
		if (h == null) {
			var h = this._canvas.height;
		}
		context.fillStyle = "rgba(0,0,0,0.5)";
		context.clearRect(0, 0, w, h);
		context.fillRect(0, 0, w, h);
	}

	protected draw(): void {
		var width = this._canvas.width;
		var fps = this._frameCount;
		this._frameCount = 0;
		this.clearRect(0, 0, width, this.barY);
		var context = this._context;
		context.fillStyle = "white";
		context.fillText("FPS: " + fps, 1, 1);
		this.drawGraph(fps);
	}

	protected drawGraph(fps: number): void {
		var width = this._canvas.width;
		var barY = this.barY;
		var barHeight = 20;
		var context = this._context;
		var data = context.getImageData(0, barY, width, barHeight);
		context.putImageData(data, -1, barY);

		context.fillStyle = "rgba(0,0,0,0.5)";
		context.clearRect(width - 1, barY, 1, barHeight);
		context.fillRect(width - 1, barY, 1, barHeight);
		var h = Math.min(1, fps / 60) * barHeight;
		context.fillStyle = "rgba(255,127,0,0.5)";
		context.fillRect(width - 1, barY + barHeight - h, 1, h);

	}
}
