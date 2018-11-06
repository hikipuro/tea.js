import * as Tea from "../Tea";

export class Stats {
	app: Tea.App;
	barY: number;
	object3d: Tea.Object3D;
	renderer: Tea.SpriteRenderer;
	texture: Tea.Texture;
	protected _enabled: boolean;
	protected _canvas: HTMLCanvasElement;
	protected _context: CanvasRenderingContext2D;
	protected _time: number;
	protected _frameCount: number;
	protected _width: number = 64;

	constructor(app: Tea.App) {
		this.app = app;
		this.initCanvas();
		this.initObject3D();
		this.barY = 14;
		this._enabled = true;
		this._time = Tea.now();
		this._frameCount = 0;
		this.clearRect(0, 0, this._width, 36);
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
		var width = 64.0 / this.app.width;
		var height = width * this.app.aspectRatio;
		this.renderer.mvpMatrix = Tea.Matrix4x4.trs(
			new Tea.Vector3(1.0 - width, 1.0 - height),
			new Tea.Quaternion(),
			new Tea.Vector3(width, height, 1.0)
		);
		this.object3d.update();
	}

	/*
	updateSize(): void {
		var canvas = this.app.canvas;
		var style = this.canvas.style;
		style.position = "absolute";
		var rect = canvas.getBoundingClientRect();
		style.left = rect.left + canvas.clientWidth - this.canvas.width + "px";
		style.top = rect.top + "px";
	}
	*/

	protected initCanvas(): void {
		this._canvas = document.createElement("canvas");
		//this._canvas.width = 60;
		//this._canvas.height = 36;
		this._canvas.width = this._width;
		this._canvas.height = 64;
		this._canvas.style.pointerEvents = "none";
		this._context = this._canvas.getContext("2d");
		this._context.textAlign = "start";
		this._context.textBaseline = "top";
		this._context.font = "10px sans-serif";
	}

	protected initObject3D(): void {
		var app = this.app;
		this.object3d = new Tea.Object3D(app);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.statsVS,
			Tea.ShaderSources.statsFS
		);
		shader.settings.enableDepthTest = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var meshFilter = this.object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = Tea.Primitives.createQuad2DMesh();
		this.texture = new Tea.Texture(app);
		this.texture.wrapMode = Tea.TextureWrapMode.Clamp;
		//var renderer = this.object3d.addComponent(Tea.MeshRenderer);
		var renderer = this.object3d.addComponent(Tea.SpriteRenderer);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.mainTexture = this.texture;
		renderer.material.shader = shader;
		this.renderer = renderer;
		this.object3d.name = "Stats";
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
		var width = this._width;//this._canvas.width;
		var fps = this._frameCount;
		this._frameCount = 0;
		this.clearRect(0, 0, width, this.barY);
		var context = this._context;
		context.fillStyle = "white";
		context.fillText("FPS: " + fps, 1, 1);
		this.drawGraph(fps);
		this.texture.image = this._canvas;
	}

	protected drawGraph(fps: number): void {
		var width = this._width;//this._canvas.width;
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
