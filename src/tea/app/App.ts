import * as Tea from "../Tea";
import { AppRenderer } from "./AppRenderer";
import { AppStatus } from "./AppStatus";

export class App {
	static useStencil: boolean = true;
	canvas: HTMLCanvasElement;
	gl: WebGLRenderingContext;
	audio: Tea.AppAudio;
	capabilities: Tea.GLCapabilities;
	parameters: Tea.GLParameters;
	readonly status: AppStatus;
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

		this.capabilities = new Tea.GLCapabilities(this.gl);
		this.parameters = new Tea.GLParameters(this.gl);
		this.status = new AppStatus(this.gl);
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
		canvas.style.width = value + "px";
		canvas.width = value * this._pixelRatio;
	}

	get height(): number {
		return this.canvas.height;
	}
	set height(value: number) {
		var canvas = this.canvas;
		canvas.style.height = value + "px";
		canvas.height = value * this._pixelRatio;
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

	get gamepad(): Tea.Gamepad {
		return this._renderer.gamepad;
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

	setScene(scene: Tea.Scene): void {
		this._renderer.currentScene = scene;
	}

	start(): void {
		this._renderer.start();
	}

	stop(): void {
		this._renderer.stop();
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
		object3d.name = "Shadow Map Camera";
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
		object3d.name = "Particle System";
		return object3d;
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
		object3d.name = "Text Mesh";
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
