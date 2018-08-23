import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class LineRenderer extends Renderer {
	points: Array<Tea.Vector3>;
	vertexBuffer: WebGLBuffer;

	constructor(app: Tea.App) {
		super(app);
		this.points = [];
		var gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();

		var shader = new Tea.Shader(this.app);
		shader.attach(
			Tea.Shader.lineVertexShaderSource,
			Tea.Shader.lineFragmentShaderSource
		);
		this.material.shader = shader;
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
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		super.render(camera);
		this.setLineData();
		this.draw();
	}
	
	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	protected setLineData(): void {
		var gl = this.app.gl;
		var target = gl.ARRAY_BUFFER;

		var vertices = new Float32Array(Tea.ArrayUtil.unroll(this.points));
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.DYNAMIC_DRAW);
		this.setAttribute("tea_Vertex", 3);
		gl.bindBuffer(target, null);
	}

	protected draw(): void {
		var gl = this.app.gl;
		var count = this.points.length;
		//gl.frontFace(gl.CW);
		gl.drawArrays(gl.LINE_STRIP, 0, count);
	}
}
