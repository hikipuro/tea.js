import * as Tea from "./Tea";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";

export class App {
	canvas: HTMLCanvasElement;
	keyboard: Keyboard;
	mouse: Mouse;
	gl: WebGLRenderingContext;
	capabilities: Tea.GLCapabilities;
	parameters: Tea.GLParameters;
	currentScene: Tea.Scene;
	isStarted: boolean;

	protected animationFrameHandle: number = 0;

	constructor(id: string) {
		this.canvas = document.getElementById(id) as HTMLCanvasElement;
		this.canvas.addEventListener("webglcontextcreationerror", this.onContextCreationError);
		this.canvas.addEventListener("webglcontextlost", this.onContextLost);
		this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
		this.init();

		//this.context.getExtension('WEBGL_lose_context').loseContext();

		this.parameters = new Tea.GLParameters(this.gl);
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

	createRenderer(mesh: Tea.Mesh, shader: Tea.Shader): Tea.Renderer {
		const renderer = new Tea.Renderer(this);
		renderer.mesh = mesh;
		renderer.shader = shader;
		return renderer;
	}

	createTexture(image: HTMLImageElement): Tea.Texture {
		const texture = new Tea.Texture(this);
		texture.image = image;
		return texture;
	}

	setScene(scene: Tea.Scene): void {
		this.currentScene = scene;
	}

	drawArrays(): void {
		const gl = this.gl;
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.flush();
	}

	start(): void {
		if (this.isStarted === true) {
			return;
		}
		this.isStarted = true;
		this.animationFrameHandle = requestAnimationFrame(this.update);
	}

	stop(): void {
		if (this.isStarted === false) {
			return;
		}
		this.isStarted = false;
		cancelAnimationFrame(this.animationFrameHandle);
	}

	createQuad(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createQuadMesh();
		const renderer = this.createRenderer(mesh, shader);
		//this.renderer.wireframe = true;
		object3d.name = "Plain";
		object3d.renderer = renderer;
		return object3d;
	}

	createCube(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCubeMesh();
		const renderer = this.createRenderer(mesh, shader);
		//this.renderer.wireframe = true;
		object3d.name = "Cube";
		object3d.renderer = renderer;
		return object3d;
	}

	createSphere(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createSphereMesh(10, 10);
		const renderer = this.createRenderer(mesh, shader);
		//renderer.wireframe = true;
		object3d.name = "Sphere";
		object3d.renderer = renderer;
		return object3d;
	}

	createCylinder(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCylinderMesh(20);
		const renderer = this.createRenderer(mesh, shader);
		//renderer.wireframe = true;
		object3d.name = "Cylinder";
		object3d.renderer = renderer;
		return object3d;
	}

	createPlane(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createPlaneMesh(10);
		const renderer = this.createRenderer(mesh, shader);
		//renderer.wireframe = true;
		object3d.name = "Plane";
		object3d.renderer = renderer;
		return object3d;
	}

	createCapsule(): Tea.Object3D {
		const object3d = new Tea.Object3D(this);
		const shader = this.createDefaultShader();
		const mesh = Tea.Primitives.createCapsuleMesh(10, 10);
		const renderer = this.createRenderer(mesh, shader);
		//renderer.wireframe = true;
		object3d.name = "Capsule";
		object3d.renderer = renderer;
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

		this.keyboard = new Keyboard(document.body);
		this.mouse = new Mouse(this, this.canvas);
	}

	protected getWebGLContext(): WebGLRenderingContext {
		if (this.canvas == null) {
			return;
		}
		return this.canvas.getContext("webgl") as WebGLRenderingContext;
	}

	protected update = (time: number): void => {
		if (this.currentScene != null) {
			this.updateScene(time);
		}
		this.animationFrameHandle = requestAnimationFrame(this.update);
	}

	protected updateScene(time: number): void {
		this.setViewport();
		this.currentScene.update(time);
		this.keyboard.update();
		this.mouse.update();
	}

	protected setViewport(): void {
		const gl = this.gl;

		const camera = this.currentScene.camera;
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

		const width = this.width;
		const height = this.height;

		gl.viewport(
			(rect.x + (rect.xMax - 1) + (1 - rect.height)) * width * 0.5,
			(rect.y * 2) * height * 0.5,
			rect.height * width,
			rect.height * height
		);
		gl.scissor(
			rect.x * width,
			rect.y * height,
			rect.width * width,
			rect.height * height
		);
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
