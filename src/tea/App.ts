import * as Electron from "electron";
import * as Tea from "./Tea";

class Status {
	frontFace: number;
	viewport: Tea.Rect;
	frameBuffer: WebGLFramebuffer;
	OES_element_index_uint: any;
	ANGLE_instanced_arrays: ANGLE_instanced_arrays;
}

export class App {
	static useStencil: boolean = true;
	canvas: HTMLCanvasElement;
	gl: WebGLRenderingContext;
	audio: Tea.AppAudio;
	capabilities: Tea.GLCapabilities;
	parameters: Tea.GLParameters;
	readonly status: Status;
	readonly cursor: Tea.Cursor;
	protected _canvasAttributes: WebGLContextAttributes;
	protected _renderer: AppRenderer;
	protected _pixelRatio: number = 1.0;

	constructor(id: string, attributes?: WebGLContextAttributes) {
		this._canvasAttributes = attributes;
		this.canvas = document.getElementById(id) as HTMLCanvasElement;
		this.canvas.addEventListener("webglcontextcreationerror", this.onContextCreationError);
		this.canvas.addEventListener("webglcontextlost", this.onContextLost);
		this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
		this.init();

		this.parameters = new Tea.GLParameters(this.gl);
		this.status = new Status();
		this.status.frontFace = this.gl.CCW;
		this.status.viewport = new Tea.Rect(0.0, 0.0, 1.0, 1.0);
		this.cursor = new Tea.Cursor(this);
		this._renderer = new AppRenderer(this);
		this.audio = new Tea.AppAudio(this);
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

	get isSceneView(): boolean {
		return this._renderer.isSceneView;
	}
	set isSceneView(value: boolean) {
		this._renderer.isSceneView = value;
	}

	get width(): number {
		return this.canvas.width;
	}
	set width(value: number) {
		var canvas = this.canvas;
		canvas.width = value * this._pixelRatio;
		canvas.style.width = value + "px";
	}

	get height(): number {
		return this.canvas.height;
	}
	set height(value: number) {
		var canvas = this.canvas;
		canvas.height = value * this._pixelRatio;
		canvas.style.height = value + "px";
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

	get isPaused(): boolean {
		return this._renderer.isPaused;
	}

	get renderer(): AppRenderer {
		return this._renderer;
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

	set clearStencil(value: number) {
		this.gl.clearStencil(value);
	}

	get isOnline(): boolean {
		return navigator.onLine;
	}

	get runInBackground(): boolean {
		return this._renderer.runInBackground;
	}
	set runInBackground(value: boolean) {
		this._renderer.runInBackground = value;
	}

	isExtensionSupported(name: Tea.GLExtensions | string): boolean {
		var extensions = this.supportedExtensions;
		return extensions.indexOf(name) >= 0;
	}

	getExtension(name: Tea.GLExtensions | string): any {
		var gl = this.gl;
		var extension = gl.getExtension(name);
		if (extension == null) {
			throw "extension not supported: " + name;
		}
		return extension;
	}

	enableUint32Index(): void {
		if (this.status.OES_element_index_uint != null) {
			return;
		}
		var name = "OES_element_index_uint";
		var ext = this.gl.getExtension(name);
		if (ext == null) {
			console.warn("App.enableUint32Index(): " + name + " is not supported");
			return;
		}
		this.status.OES_element_index_uint = ext;
	}

	enableInstancedArrays(): void {
		if (this.status.ANGLE_instanced_arrays != null) {
			return;
		}
		var name = "ANGLE_instanced_arrays";
		var ext = this.gl.getExtension(name);
		if (ext == null) {
			console.warn("App.enableInstancedArrays(): " + name + " is not supported");
			return;
		}
		this.status.ANGLE_instanced_arrays = ext;
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

	setPixelRatio(ratio: number): void {
		this._pixelRatio = ratio;
		this.width = this.width;
		this.height = this.height;
	}

	createObject3D(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "Empty";
		return object3d;
	}

	createScene(): Tea.Scene {
		var scene = new Tea.Scene(this);
		return scene;
	}

	createSceneFromJSON(data: any): Tea.Scene {
		var scene = Tea.Scene.fromJSON(this, data);
		return scene;
	}

	createDirectionalLight(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "Directional Light";
		object3d.localPosition.set(0, 10, 0);
		object3d.localRotation = Tea.Quaternion.euler(50, -30, 0);
		object3d.addComponent(Tea.Light);
		return object3d;
	}

	createPointLight(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "Point Light";
		object3d.localPosition.set(0, 10, 0);
		var light = object3d.addComponent(Tea.Light);
		light.type = Tea.LightType.Point;
		return object3d;
	}

	createSpotLight(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "Spot Light";
		object3d.localPosition.set(0, 10, 0);
		object3d.localRotation = Tea.Quaternion.euler(50, -30, 0);
		var light = object3d.addComponent(Tea.Light);
		light.type = Tea.LightType.Spot;
		return object3d;
	}

	createCamera(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "Camera";
		object3d.localPosition.set(0, 1, -10);
		object3d.addComponent(Tea.Camera);
		return object3d;
	}

	createShadowMapCamera(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		object3d.name = "ShadowMapCamera";
		object3d.localPosition.set(0, 1, -10);
		object3d.addComponent(Tea.ShadowMapCamera);
		return object3d;
	}

	createDefaultShader(): Tea.Shader {
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.ShaderSources.defaultVS,
			Tea.ShaderSources.defaultFS
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

	createLineRenderer(): Tea.Object3D {
		var object3d = new Tea.Object3D(this);
		var renderer = object3d.addComponent(Tea.LineRenderer);
		var shader = new Tea.Shader(this);
		shader.attach(
			Tea.ShaderSources.lineVS,
			Tea.ShaderSources.lineFS
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		renderer.material = Tea.Material.getDefault(this);
		renderer.material.shader = shader;
		return object3d;
	}

	createTexture(image: HTMLImageElement): Tea.Texture {
		var texture = new Tea.Texture(this);
		texture.image = image;
		return texture;
	}

	createParticleSystem(): Tea.Object3D {
		this.enableInstancedArrays();
		var object3d = new Tea.Object3D(this);
		object3d.rotate(-90.0, 0.0, 0.0);
		var shader = new Tea.Shader(this);
		if (this.status.ANGLE_instanced_arrays != null) {
			shader.attach(
				Tea.ShaderSources.particleInstancingVS,
				Tea.ShaderSources.particleInstancingFS
			);
		} else {
			shader.attach(
				Tea.ShaderSources.particleVS,
				Tea.ShaderSources.particleFS
			);
		}
		//shader.settings.enableDepthTest = false;
		shader.settings.depthWriteMask = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		object3d.addComponent(Tea.ParticleSystem);
		var renderer = object3d.addComponent(Tea.ParticleSystemRenderer);
		renderer.material = Tea.Material.getDefault(this);
		renderer.material.shader = shader;
		renderer.material.mainTexture = Tea.Texture.getDefaultParticle(this);
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
			Tea.ShaderSources.textVS,
			Tea.ShaderSources.textFS
		);
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var textMesh = object3d.addComponent(Tea.TextMesh);
		textMesh.texture.filterMode = Tea.FilterMode.Point;
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = textMesh.mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material = Tea.Material.getDefault(this);
		renderer.material.renderQueue = 3000;
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.mainTexture = textMesh.texture;
		renderer.material.shader = shader;
		//renderer.material.color.set(1,0,0,1);
		textMesh.material = renderer.material;
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
		gl.scissor(0.0, 0.0, this.width, this.height);

		if (this._canvasAttributes.stencil) {
			gl.clearStencil(0);
			//gl.enable(gl.STENCIL_TEST);
		}
	}

	protected getWebGLContext(): WebGLRenderingContext {
		if (this.canvas == null) {
			return;
		}
		var attributes: WebGLContextAttributes = {
			stencil: App.useStencil
		};
		this._canvasAttributes = Object.assign(
			attributes, this._canvasAttributes
		);
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
	runInBackground: boolean;
	protected _fps: number;
	protected _interval: number;
	protected _isSceneView: boolean;
	protected _lastTime: number;
	protected _update: FrameRequestCallback;
	protected _handle: number;

	constructor(app: App) {
		super();
		this.app = app;
		this.isStarted = false;
		this.isPaused = false;
		this.keyboard = new Tea.Keyboard(document.body);
		this.mouse = new Tea.Mouse(app, this.app.canvas);
		this.time = new Tea.Time();
		this.runInBackground = false;
		this._fps = 60.0;
		this._interval = 1000.0 / this._fps;
		this._isSceneView = false;
		this._lastTime = 0.0;
		this._update = this.update;
		this._handle = 0;
		this.createStats();

		window.addEventListener("blur", () => {
			if (this.runInBackground) {
				return;
			}
			if (this.isStarted && this.isPaused === false) {
				cancelAnimationFrame(this._handle);
				this._handle = 0;
			}
			this.isPaused = true;
			this.emit("pause");
		});
		window.addEventListener("focus", () => {
			if (this.runInBackground) {
				return;
			}
			if (this.isStarted && this.isPaused) {
				this._lastTime = performance.now();
				this._handle = requestAnimationFrame(this._update);
			}
			this.isPaused = false;
			this.emit("resume");
		});
		window.addEventListener("resize", Tea.debounce(() => {
			this.dispatchResizeEvent();
		}, 250));
		if (Electron && Electron.remote) {
			var browserWindow = Electron.remote.getCurrentWindow();
			browserWindow.on("enter-full-screen", () => {
				setTimeout(() => {
					this.dispatchResizeEvent();
				}, 100);
			});
			browserWindow.on("leave-full-screen", () => {
				this.dispatchResizeEvent();
			});
			browserWindow.on("maximize", () => {
				this.dispatchResizeEvent();
			});
			browserWindow.on("unmaximize", () => {
				this.dispatchResizeEvent();
			});
		}
	}

	get fps(): number {
		return this._fps;
	}
	set fps(value: number) {
		this._fps = value;
		this._interval = 1000.0 / value;
	}

	get isSceneView(): boolean {
		return this._isSceneView;
	}
	set isSceneView(value: boolean) {
		if (this._isSceneView === value) {
			return;
		}
		this._isSceneView = value;
		if (value) {
			this._update = this.updateScene;
		} else {
			this._update = this.update;
		}
	}

	dispatchResizeEvent(): void {
		this.emit("resize");
		this.once("update", () => {
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
			this._lastTime = performance.now();
			this._handle = requestAnimationFrame(this._update);
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
		if (time < this._lastTime + this._interval) {
			this._handle = requestAnimationFrame(this._update);
			return;
		}
		this._lastTime += this._interval;
		//Tea.Vector3.newCount = 0;
		//Tea.Quaternion.newCount = 0;
		//Tea.Matrix4x4.newCount = 0;
		this.time.update();
		if (this.currentScene != null) {
			this.currentScene.update();
			this.keyboard.update();
			this.mouse.update();
		}
		this.stats.update();
		this.emit("update");
		this._handle = requestAnimationFrame(this._update);
		//console.log("Tea.Vector3.newCount", Tea.Vector3.newCount);
		//console.log("Tea.Quaternion.newCount", Tea.Quaternion.newCount);
		//console.log("Tea.Matrix4x4.newCount", Tea.Matrix4x4.newCount);
	}

	protected updateScene = (time: number): void => {
		if (time < this._lastTime + this._interval) {
			this._handle = requestAnimationFrame(this._update);
			return;
		}
		this._lastTime += this._interval;
		this.time.update();
		if (this.currentScene != null) {
			this.currentScene.updateScene();
			this.keyboard.update();
			this.mouse.update();
		}
		this.stats.update();
		this.emit("update");
		this._handle = requestAnimationFrame(this._update);
	}

	protected createStats(): void {
		var stats = new Tea.Stats(this.app);
		document.body.appendChild(stats.canvas);
		this.stats = stats;
	}
}
