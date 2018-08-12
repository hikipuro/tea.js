import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class LineRenderer extends Renderer {
	app: Tea.App;
	points: Array<Tea.Vector3>;
	color: Tea.Color;
	vertexBuffer: WebGLBuffer;

	constructor(app: Tea.App) {
		super();
		this.app = app;
		this.points = [];
		this.color = Tea.Color.white;
		const gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();
	}

	add(x: number, y: number, z: number): void;
	add(point: Tea.Vector3): void;
	add(x: Tea.Vector3 | number, y: number = 0, z: number = 0): void {
		if (x == null) {
			return;
		}
		if (x instanceof Tea.Vector3) {
			this.points.push(x);
		} else {
			this.points.push(new Tea.Vector3(x, y, z));
		}
	}

	remove(index: number): void {
		if (index < 0 || index >= this.points.length) {
			return;
		}
		this.points.splice(index, 1);
	}

	render(camera: Tea.Camera): void {
		if (camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		this.setUniforms(camera);
		this.setLineData();
		this.draw();
	}
	
	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.shader != null
		);
	}

	protected setUniforms(camera: Tea.Camera): void {
		let model = this.localToWorldMatrix;
		let view = camera.cameraToWorldMatrix;
		let proj = camera.projectionMatrix;

		const mvpMatrix = proj.mul(view).mul(model);
		this.shader.uniformMatrix4fv("mvpMatrix", mvpMatrix);
		this.shader.uniform4fv("color", this.color);
	}

	protected setLineData(): void {
		const gl = this.app.gl;
		let target = gl.ARRAY_BUFFER;

		const vertices = new Float32Array(this.unroll(this.points));
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.STATIC_DRAW);
		this.shader.setAttribute("position", 3);

		gl.bindBuffer(target, null);
		target = gl.ELEMENT_ARRAY_BUFFER;
		gl.bindBuffer(target, null);
	}

	protected draw(): void {
		const gl = this.app.gl;
		const count = this.points.length;
		//gl.frontFace(gl.CW);
		gl.drawArrays(gl.LINE_STRIP, 0, count);
	}

	protected unroll(array: Array<any>): Array<number> {
		if (array == null || array.length <= 0) {
			return [];
		}
		const length = array.length;
		const a = [];
		for (let i = 0; i < length; i++) {
			const item = array[i];
			a.push.apply(a, item);
		}
		return a;
	}
}