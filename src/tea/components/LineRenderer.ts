import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class LineRenderer extends Renderer {
	points: Array<Tea.Vector3>;
	vertexBuffer: WebGLBuffer;
	shader: Tea.Shader;

	constructor(app: Tea.App) {
		super(app);
		this.points = [];
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.shader = new Tea.Shader(this.app);
		this.shader.attach(
			Tea.ShaderSources.lineVS,
			Tea.ShaderSources.lineFS
		);
	}

	destroy(): void {
		var gl = this.gl;
		this.points = undefined;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		super.destroy();
	}

	update(): void {
		if (this.material == null) {
			return;
		}
		if (this.material.shader == null) {
			this.material.shader = this.shader;
		}
	}

	add(x: number, y: number, z: number): void;
	add(point: Tea.Vector3): void;
	add(x: Tea.Vector3 | number, y: number = 0.0, z: number = 0.0): void {
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

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (!this.isRenderable) {
			return;
		}
		super.render(camera, lights, renderSettings);
		this.setLineData();
		this.draw();
		Renderer.drawCallCount++;
	}
	
	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "LineRenderer"
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): LineRenderer {
		if (json == null || json._type !== "LineRenderer") {
			return null;
		}
		var lineRenderer = new LineRenderer(app);
		lineRenderer.enabled = json.enabled;
		return lineRenderer;
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	protected setLineData(): void {
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;

		var vertices = new Float32Array(Tea.ArrayUtil.unroll(this.points));
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.DYNAMIC_DRAW);

		var shader = this.material.shader;
		var attributes = Renderer.attributes;
		var location = shader.getAttribLocation("vertex");
		if (attributes.isEnabled(location) === false) {
			gl.enableVertexAttribArray(location);
		}
		attributes.enable(location);
		attributes.end(gl);
		this.vertexAttribPointer("vertex", 3);
		//gl.bindBuffer(target, null);
	}

	protected draw(): void {
		var count = this.points.length;
		if (count <= 0) {
			return;
		}
		var gl = this.gl;
		gl.drawArrays(gl.LINES, 0, count);
	}
}
