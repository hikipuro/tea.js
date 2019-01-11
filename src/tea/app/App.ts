import * as Tea from "../Tea";
import { AppRenderer } from "./AppRenderer";
import { AppStatus } from "./AppStatus";
import { ObjectFactory } from "./ObjectFactory";

export class App {
	protected _canvasAttributes: WebGLContextAttributes;
	protected _canvas: HTMLCanvasElement;
	protected _gl: WebGLRenderingContext;
	protected _capabilities: Tea.GLCapabilities;
	protected _parameters: Tea.GLParameters;
	protected _status: AppStatus;
	protected _cursor: Tea.Cursor;
	protected _renderer: AppRenderer;
	protected _audio: Tea.AppAudio;
	protected _pixelRatio: number;

	constructor(canvasId: string, attributes?: WebGLContextAttributes) {
		this._canvasAttributes = attributes;
		this.init(canvasId);
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

	get isEditing(): boolean {
		return this._status.isEditing;
	}
	set isEditing(value: boolean) {
		this._status.isEditing = value;
	}

	get width(): number {
		return this._canvas.width;
	}
	set width(value: number) {
		var canvas = this._canvas;
		canvas.style.width = value + "px";
		canvas.width = value * this._pixelRatio;
	}

	get height(): number {
		return this._canvas.height;
	}
	set height(value: number) {
		var canvas = this._canvas;
		canvas.style.height = value + "px";
		canvas.height = value * this._pixelRatio;
	}

	get drawingBufferWidth(): number {
		return this._gl.drawingBufferWidth;
	}

	get drawingBufferHeight(): number {
		return this._gl.drawingBufferHeight;
	}

	get aspectRatio(): number {
		return this.width / this.height;
	}

	get canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	get gl(): WebGLRenderingContext {
		return this._gl;
	}

	get capabilities(): Tea.GLCapabilities {
		return this._capabilities;
	}

	get parameters(): Tea.GLParameters {
		return this.parameters;
	}

	get contextAttributes(): WebGLContextAttributes {
		return this._gl.getContextAttributes();
	}

	get supportedExtensions(): Array<string> {
		return this._gl.getSupportedExtensions();
	}

	get isStarted(): boolean {
		return this._renderer.isStarted;
	}

	get isPaused(): boolean {
		return this._renderer.isPaused;
	}

	get status(): AppStatus {
		return this._status;
	}

	get cursor(): Tea.Cursor {
		return this._cursor;
	}

	get renderer(): AppRenderer {
		return this._renderer;
	}

	get audio(): Tea.AppAudio {
		return this._audio;
	}

	get scene(): Tea.Scene {
		return this._renderer.scene;
	}
	set scene(value: Tea.Scene) {
		if (value == null) {
			return;
		}
		if (this._renderer.scene === value) {
			return;
		}
		this._renderer.scene = value;
		this._renderer.emit("changeScene", value);
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

	get isOnline(): boolean {
		return navigator.onLine;
	}

	get runInBackground(): boolean {
		return this._renderer.runInBackground;
	}
	set runInBackground(value: boolean) {
		this._renderer.runInBackground = value;
	}

	get pixelRatio(): number {
		return this._pixelRatio;
	}
	set pixelRatio(ratio: number) {
		this._pixelRatio = ratio;
		this.width = this.width;
		this.height = this.height;
	}

	isExtensionSupported(name: Tea.GLExtensions | string): boolean {
		var extensions = this.supportedExtensions;
		return extensions.indexOf(name) >= 0;
	}

	getExtension(name: Tea.GLExtensions | string): any {
		var gl = this._gl;
		var extension = gl.getExtension(name);
		if (extension == null) {
			throw "extension not supported: " + name;
		}
		return extension;
	}

	enableUint32Index(): void {
		this.status.enableUint32Index();
	}

	enableInstancedArrays(): void {
		this.status.enableInstancedArrays();
	}

	captureScreenshot(callback: (data: ArrayBuffer) => void, type: string = "image/png"): void {
		if (callback == null) {
			return;
		}
		this._renderer.once("update", () => {
			var url = this._canvas.toDataURL(type);
			var data = atob(url.split(",")[1]);
			var buffer = new Uint8Array(data.length);
			for (var i = 0; i < data.length; i++) {
				buffer[i] = data.charCodeAt(i);
			}
			callback(buffer.buffer as ArrayBuffer);
		});
	}

	loadScene(path: string): void {
		if (this.isEditing) {
			return;
		}
		if (this.status.isEditor) {
			path = process.cwd() + "/assets/" + path;
		}
		Tea.File.readText(path, (err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			var prevScene = this.scene;
			var json = JSON.parse(data);
			Tea.SceneLoader.load(this, json, (scene: Tea.Scene) => {
				if (scene == null) {
					console.log("error: load scene", path);
					return;
				}
				this.scene = scene;
				if (prevScene) {
					prevScene.destroy();
				}
			});
		});
	}

	start(): void {
		this._renderer.start();
	}

	stop(): void {
		this._renderer.stop();
	}

	createObject3D(): Tea.Object3D {
		return ObjectFactory.createObject3D(this);
	}

	createScene(): Tea.Scene {
		return ObjectFactory.createScene(this);
	}

	//createSceneFromJSON(data: any): Tea.Scene {
	//	return ObjectFactory.createSceneFromJSON(this, data);
	//}

	createPrimitive(type: Tea.PrimitiveType): Tea.Object3D {
		return Tea.Object3D.createPrimitive(this, type);
	}

	createDirectionalLight(): Tea.Object3D {
		return ObjectFactory.createDirectionalLight(this);
	}

	createPointLight(): Tea.Object3D {
		return ObjectFactory.createPointLight(this);
	}

	createSpotLight(): Tea.Object3D {
		return ObjectFactory.createSpotLight(this);
	}

	createAudioSource(): Tea.Object3D {
		return ObjectFactory.createAudioSource(this);
	}

	createCamera(): Tea.Object3D {
		return ObjectFactory.createCamera(this);
	}

	createShadowMapCamera(): Tea.Object3D {
		return ObjectFactory.createShadowMapCamera(this);
	}

	//createDefaultShader(): Tea.Shader {
	//	return ObjectFactory.createDefaultShader(this);
	//}

	createShader(vs: string, fs: string): Tea.Shader {
		return ObjectFactory.createShader(this, vs, fs);
	}

	createMeshRenderer(shader: Tea.Shader): Tea.MeshRenderer {
		return ObjectFactory.createMeshRenderer(this, shader);
	}

	createLineRenderer(): Tea.Object3D {
		return ObjectFactory.createLineRenderer(this);
	}

	createTexture(image: HTMLImageElement): Tea.Texture {
		return ObjectFactory.createTexture(this, image);
	}

	createParticleSystem(): Tea.Object3D {
		return ObjectFactory.createParticleSystem(this);
	}

	createTextMesh(): Tea.Object3D {
		return ObjectFactory.createTextMesh(this);
	}

	createCanvas(): Tea.Object3D {
		return ObjectFactory.createCanvas(this);
	}

	createUIImage(): Tea.Object3D {
		return ObjectFactory.createUIImage(this);
	}

	createUIButton(): Tea.Object3D {
		return ObjectFactory.createUIButton(this);
	}

	createUIRadioButton(): Tea.Object3D {
		return ObjectFactory.createUIRadioButton(this);
	}

	createUICheckbox(): Tea.Object3D {
		return ObjectFactory.createUICheckbox(this);
	}

	createUIText(): Tea.Object3D {
		return ObjectFactory.createUIText(this);
	}

	createUISlider(): Tea.Object3D {
		return ObjectFactory.createUISlider(this);
	}

	readObjFile(url: string, callback: (object3d: Tea.Object3D) => void): void {
		if (callback == null) {
			return;
		}
		var reader = new Tea.ObjReader(this);
		reader.readFile(url, callback);
	}

	resolvePath(path: string): string {
		if (!this.status.isEditor) {
			return path;
		}
		if (path.indexOf("/") !== 0 && !path.match(/^[a-z]:\\/i)) {
			path = process.cwd() + "/assets/" + path;
		}
		/*
		if (process.platform === "win32") {
			path = path.replace(/\//g, "\\");
		}
		//*/
		return path;
	}

	protected init(canvasId: string): void {
		this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this._canvas.addEventListener(
			"webglcontextcreationerror",
			this.onContextCreationError
		);
		this._canvas.addEventListener(
			"webglcontextlost",
			this.onContextLost
		);
		this._canvas.addEventListener(
			"webglcontextrestored",
			this.onContextRestored
		);

		this._gl = this.getWebGLContext();
		var gl = this._gl;
		this._capabilities = new Tea.GLCapabilities(gl);
		this._parameters = new Tea.GLParameters(gl);
		this._status = new AppStatus(gl);
		this._cursor = new Tea.Cursor(this);
		this._renderer = new AppRenderer(this);
		this._audio = new Tea.AppAudio(this);
		this._pixelRatio = 1.0;
	}

	protected getWebGLContext(): WebGLRenderingContext {
		if (this._canvas == null) {
			return;
		}
		var attributes: WebGLContextAttributes = {
			stencil: true
		};
		this._canvasAttributes = Object.assign(
			attributes, this._canvasAttributes
		);
		var context = this._canvas.getContext(
			"webgl",
			this._canvasAttributes
		) as WebGLRenderingContext;
		if (context == null) {
			context = this._canvas.getContext(
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
