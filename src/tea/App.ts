import * as Tea from "./Tea";

export class App {
	canvas: HTMLCanvasElement;
	gl: WebGLRenderingContext;
	capabilities: Tea.GLCapabilities;
	parameters: Tea.GLParameters;
	readonly cursor: Tea.Cursor;
	protected _canvasAttributes: WebGLContextAttributes;
	protected _renderer: AppRenderer;

	constructor(id: string, attributes?: WebGLContextAttributes) {
		this._canvasAttributes = attributes;
		this.canvas = document.getElementById(id) as HTMLCanvasElement;
		this.canvas.addEventListener("webglcontextcreationerror", this.onContextCreationError);
		this.canvas.addEventListener("webglcontextlost", this.onContextLost);
		this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
		this.init();

		this.parameters = new Tea.GLParameters(this.gl);
		this.cursor = new Tea.Cursor(this);
		this._renderer = new AppRenderer(this);
	}

	static get absoluteURL(): string {
		return location.href;
	}

	static get isFocused(): boolean {
		return document.hasFocus();
	}

	static get systemLanguage(): string {
		return navigator.language;
	}

	static get teaVersion(): string {
		return "0.1.0";
	}

	get width(): number {
		return this.canvas.width;
	}
	set width(value: number) {
		this.canvas.width = value;
		this.onResize();
	}

	get height(): number {
		return this.canvas.height;
	}
	set height(value: number) {
		this.canvas.height = value;
		this.onResize();
	}

	get drawingBufferWidth(): number {
		return this.gl.drawingBufferWidth;
	}

	get drawingBufferHeight(): number {
		return this.gl.drawingBufferHeight;
	}

	get aspectRatio(): number {
		return this.width / this.height;
	}

	get contextAttributes(): WebGLContextAttributes {
		return this.gl.getContextAttributes();
	}

	get supportedExtensions(): Array<string> {
		return this.gl.getSupportedExtensions();
	}

	get isStarted(): boolean {
		return this._renderer.isStarted;
	}

	get currentScene(): Tea.Scene {
		return this._renderer.currentScene;
	}
	
	get keyboard(): Tea.Keyboard {
		return this._renderer.keyboard;
	}

	get mouse(): Tea.Mouse {
		return this._renderer.mouse;
	}

	get time(): Tea.Time {
		return this._renderer.time;
	}

	isExtensionSupported(name: Tea.GLExtensions | string): boolean {
		var extensions = this.supportedExtensions;
		return extensions.indexOf(name) >= 0;
	}

	captureScreenshot(callback: (data: ArrayBuffer) => void, type: string = "image/png"): void {
		if (callback == null) {
			return;
		}
		this._renderer.once("update", () => {
			var url = this.canvas.toDataURL(type);
			var data = atob(url.split(",")[1]);
			var buffer = new Uint8Array(data.length);
			for (var i = 0; i < data.length; i++) {
				buffer[i] = data.charCodeAt(i);
			}
			callback(buffer.buffer);
		});
	}

	createObject3D(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		return object3d;
	}

	createScene(): Tea.Scene {
		var scene = new Tea.Scene(this);
		return scene;
	}

	createDefaultShader(): Tea.Shader {
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.defaultVertexShaderSource,
			Tea.Shader.defaultFragmentShaderSource
		);
		return shader;
	}

	createShader(vs: string, fs: string): Tea.Shader {
		var shader = new Tea.Shader(this);
		shader.attach(vs, fs);
		return shader;
	}

	createMeshRenderer(shader: Tea.Shader): Tea.MeshRenderer {
		var renderer = new Tea.MeshRenderer(this);
		renderer.material.shader = shader;
		return renderer;
	}

	createLineRenderer(): Tea.LineRenderer {
		var renderer = new Tea.LineRenderer(this);
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.lineVertexShaderSource,
			Tea.Shader.lineFragmentShaderSource
		);
		renderer.material.shader = shader;
		return renderer;
	}

	createTexture(image: HTMLImageElement): Tea.Texture {
		var texture = new Tea.Texture(this);
		texture.image = image;
		return texture;
	}

	createParticleSystem(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.particleVertexShaderSource,
			Tea.Shader.particleFragmentShaderSource
		);
		object3d.addComponent(Tea.ParticleSystem);
		var renderer = object3d.addComponent(Tea.ParticleSystemRenderer);
		renderer.material.shader = shader;
		object3d.name = "ParticleSystem";
		return object3d;
	}

	setScene(scene: Tea.Scene): void {
		this._renderer.currentScene = scene;
	}

	drawArrays(): void {
		var gl = this.gl;
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.flush();
	}

	start(): void {
		this._renderer.start();
	}

	stop(): void {
		this._renderer.stop();
	}

	createTextMesh(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.textVertexShaderSource,
			Tea.Shader.textFragmentShaderSource
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var mesh = new Tea.TextMesh(this);
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material.renderQueue = 3000;
		renderer.material.mainTexture = mesh.texture;
		renderer.material.shader = shader;
		object3d.name = "TextMesh";
		return object3d;
	}

	readObjFile(url: string, callback: (object3d: Tea.Object3D) => void): void {
		if (callback == null) {
			return;
		}
		var reader = new Tea.ObjReader(this);
		reader.readFile(url, callback);
	}

	protected init(): void {
		this.gl = this.getWebGLContext();
		var gl = this.gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		gl.enable(gl.SCISSOR_TEST);
		gl.scissor(0, 0, this.width, this.height);
	}

	protected getWebGLContext(): WebGLRenderingContext {
		if (this.canvas == null) {
			return;
		}
		var context = this.canvas.getContext(
			"webgl",
			this._canvasAttributes
		) as WebGLRenderingContext;
		if (context == null) {
			context = this.canvas.getContext(
				"experimental-webgl",
				this._canvasAttributes
			) as WebGLRenderingContext;
		}
		return context;
	}

	protected onResize() {
		//var gl = this.gl;
		//gl.viewport(100 / 2, 0, this.width, this.height);
		//gl.scissor(100, 0, this.width, this.height);
	}


	protected onContextCreationError = (event: WebGLContextEvent) => {
		console.error("webglcontextcreationerror", event);
	}

	protected onContextLost = (event: WebGLContextEvent) => {
		console.error("webglcontextlost", event);
	}

	protected onContextRestored = (event: WebGLContextEvent) => {
		console.warn("webglcontextrestored", event);
	}
}

class AppRenderer extends Tea.EventDispatcher {
	app: App;
	isStarted: boolean;
	isPaused: boolean;
	currentScene: Tea.Scene;
	keyboard: Tea.Keyboard;
	mouse: Tea.Mouse;
	time: Tea.Time;
	stats: Tea.Stats;
	protected _handle: number;

	constructor(app: App) {
		super();
		this.app = app;
		this.isStarted = false;
		this.isPaused = false;
		this.keyboard = new Tea.Keyboard(document.body);
		this.mouse = new Tea.Mouse(app, this.app.canvas);
		this.time = new Tea.Time();
		this._handle = 0;
		this.createStats();

		window.addEventListener("blur", () => {
			if (this.isStarted && this.isPaused === false) {
				cancelAnimationFrame(this._handle);
				this._handle = 0;
			}
			this.isPaused = true;
		});
		window.addEventListener("focus", () => {
			if (this.isStarted && this.isPaused) {
				this._handle = requestAnimationFrame(this.update);
			}
			this.isPaused = false;
		});
		window.addEventListener("resize", () => {
			this.stats.updateSize();
		});
	}

	start(): void {
		if (this.isStarted === true) {
			return;
		}
		this.isStarted = true;
		this.time.start();
		if (this.isPaused === false) {
			this.stats.updateSize();
			this._handle = requestAnimationFrame(this.update);
		}
	}

	stop(): void {
		if (this.isStarted === false) {
			return;
		}
		this.isStarted = false;
		if (this.isPaused === false) {
			cancelAnimationFrame(this._handle);
			this._handle = 0;
		}
	}

	protected update = (time: number): void => {
		this.time.update();
		if (this.currentScene != null) {
			this.updateScene();
		}
		this.stats.update();
		this.emit("update");
		this._handle = requestAnimationFrame(this.update);
	}

	protected updateScene(): void {
		this.currentScene.update();
		this.keyboard.update();
		this.mouse.update();
	}

	protected createStats(): void {
		var stats = new Tea.Stats(this.app);
		document.body.appendChild(stats.canvas);
		this.stats = stats;
	}
}
