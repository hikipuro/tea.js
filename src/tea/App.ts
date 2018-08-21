import * as Tea from "./Tea";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";

export class App {
	canvas: HTMLCanvasElement;
	gl: WebGLRenderingContext;
	capabilities: Tea.GLCapabilities;
	parameters: Tea.GLParameters;
	readonly cursor: Tea.Cursor;
	protected _renderer: AppRenderer;

	constructor(id: string) {
		this.canvas = document.getElementById(id) as HTMLCanvasElement;
		this.canvas.addEventListener("webglcontextcreationerror", this.onContextCreationError);
		this.canvas.addEventListener("webglcontextlost", this.onContextLost);
		this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
		this.init();

		//this.context.getExtension('WEBGL_lose_context').loseContext();

		this.parameters = new Tea.GLParameters(this.gl);
		this.cursor = new Tea.Cursor(this);
		this._renderer = new AppRenderer(this);
		//this.clear();
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
	
	get keyboard(): Keyboard {
		return this._renderer.keyboard;
	}

	get mouse(): Mouse {
		return this._renderer.mouse;
	}

	get time(): Tea.Time {
		return this._renderer.time;
	}

	isExtensionSupported(name: Tea.GLExtensions | string): boolean {
		const extensions = this.supportedExtensions;
		return extensions.indexOf(name) >= 0;
	}

	createObject3D(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		return object3d;
	}

	createScene(): Tea.Scene {
		const scene = new Tea.Scene(this);
		return scene;
	}

	createDefaultShader(): Tea.Shader {
		const shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.defaultVertexShaderSource,
			Tea.Shader.defaultFragmentShaderSource
		);
		return shader;
	}

	createShader(vs: string, fs: string): Tea.Shader {
		const shader = new Tea.Shader(this);
		shader.attach(vs, fs);
		return shader;
	}

	createMeshRenderer(mesh: Tea.Mesh, shader: Tea.Shader): Tea.MeshRenderer {
		const renderer = new Tea.MeshRenderer(this);
		renderer.mesh = mesh;
		renderer.shader = shader;
		return renderer;
	}

	createLineRenderer(): Tea.LineRenderer {
		const renderer = new Tea.LineRenderer(this);
		const shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.lineVertexShaderSource,
			Tea.Shader.lineFragmentShaderSource
		);
		renderer.shader = shader;
		return renderer;
	}

	createTexture(image: HTMLImageElement): Tea.Texture {
		const texture = new Tea.Texture(this);
		texture.image = image;
		return texture;
	}

	setScene(scene: Tea.Scene): void {
		this._renderer.currentScene = scene;
	}

	drawArrays(): void {
		const gl = this.gl;
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.flush();
	}

	start(): void {
		this._renderer.start();
	}

	stop(): void {
		this._renderer.stop();
	}

	createQuad(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createQuadMesh();
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Quad";
		return object3d;
	}

	createCube(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCubeMesh();
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Cube";
		return object3d;
	}

	createSphere(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createSphereMesh(10, 10);
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Sphere";
		return object3d;
	}

	createCylinder(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCylinderMesh(20);
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Cylinder";
		return object3d;
	}

	createPlane(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createPlaneMesh(10);
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Plane";
		return object3d;
	}

	createCapsule(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCapsuleMesh(10, 10);
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		object3d.name = "Capsule";
		return object3d;
	}

	createTextMesh(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		//const shader = this.createDefaultShader();
		const shader = new Tea.Shader(this);
		shader.attach(
			Tea.Shader.textVertexShaderSource,
			Tea.Shader.textFragmentShaderSource
		);
		const mesh = new Tea.TextMesh(this);
		const renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.shader = shader;
		renderer.mesh = mesh;
		shader.texture = mesh.texture;
		object3d.name = "TextMesh";
		return object3d;
	}

	protected init(): void {
		this.gl = this.getWebGLContext();
		const gl = this.gl;
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
		const attribute: WebGLContextAttributes = {
			antialias: false
		};
		let context = this.canvas.getContext(
			"webgl", attribute
		) as WebGLRenderingContext;
		if (context == null) {
			context = this.canvas.getContext(
				"experimental-webgl", attribute
			) as WebGLRenderingContext;
		}
		return context;
	}

	protected onResize() {
		//const gl = this.gl;
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

class AppRenderer {
	app: App;
	isStarted: boolean;
	isPaused: boolean;
	currentScene: Tea.Scene;
	keyboard: Keyboard;
	mouse: Mouse;
	time: Tea.Time;
	protected _handle: number;
	protected _prevRect: Tea.Rect;

	constructor(app: App) {
		this.app = app;
		this.isStarted = false;
		this.isPaused = false;
		this.keyboard = new Keyboard(document.body);
		this.mouse = new Mouse(app, this.app.canvas);
		this.time = new Tea.Time();
		this._handle = 0;
		this._prevRect = new Tea.Rect();

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
	}

	start(): void {
		if (this.isStarted === true) {
			return;
		}
		this.isStarted = true;
		this.time.start();
		if (this.isPaused === false) {
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
		this._handle = requestAnimationFrame(this.update);
	}

	protected updateScene(): void {
		this.setViewport();
		this.currentScene.update();
		this.keyboard.update();
		this.mouse.update();
	}

	protected setViewport(): void {
		const gl = this.app.gl;
		const camera = this.currentScene.camera;

		if (this._prevRect.equals(camera.rect)) {
			return;
		}

		const rect = camera.rect.clone();
		if (rect.x < 0) {
			rect.width += rect.x;
			rect.x = 0;
		}
		if (rect.y < 0) {
			rect.height += rect.y;
			rect.y = 0;
		}
		if (rect.xMax > 1) {
			rect.width = 1 - rect.x;
		}
		if (rect.yMax > 1) {
			rect.height = 1 - rect.y;
		}

		const width = this.app.width;
		const height = this.app.height;

		gl.viewport(
			rect.x * width,
			rect.y * height,
			rect.width * width,
			rect.height * height
		);
		gl.scissor(
			rect.x * width,
			rect.y * height,
			rect.width * width,
			rect.height * height
		);
	}
}
