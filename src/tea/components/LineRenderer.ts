import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class LineRenderer extends Renderer {
	static readonly className: string = "LineRenderer";
	points: Array<Tea.Vector3>;
	vertexBuffer: WebGLBuffer;
	shader: Tea.Shader;
	protected _isChanged: boolean;

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
		this._isChanged = false;
	}

	destroy(): void {
		var gl = this.gl;
		this.points = undefined;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		this._isChanged = undefined;
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

	clear(): void {
		this._isChanged = true;
		this.points = [];
	}

	add(x: number, y: number, z: number): void;
	add(point: Tea.Vector3): void;
	add(x: Tea.Vector3 | number, y: number = 0.0, z: number = 0.0): void {
		if (x == null) {
			return;
		}
		this._isChanged = true;
		if (x instanceof Tea.Vector3) {
			var point = x.clone();
			point[2] = -point[2];
			this.points.push(point);
		} else {
			this.points.push(new Tea.Vector3(x, y, -z));
		}
	}

	remove(index: number): void {
		if (index < 0 || index >= this.points.length) {
			return;
		}
		this._isChanged = true;
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
		if (this._isChanged) {
			this.setLineData();
			this._isChanged = false;
		}
		this.draw();
		Renderer.drawCallCount++;
	}
	
	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = LineRenderer.className;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, LineRenderer.className) === false) {
			callback(null);
			return;
		}
		var lineRenderer = new LineRenderer(app);
		lineRenderer.enabled = json.enabled;
		callback(lineRenderer);
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this.points.length > 0
		);
	}

	protected setLineData(): void {
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;

		var vertices = new Float32Array(Tea.ArrayUtil.unroll(this.points));
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.DYNAMIC_DRAW);
	}

	protected draw(): void {
		var gl = this.gl;
		var count = this.points.length;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		var attributes = Renderer.attributes;
		var location = this.material.shader.getAttribLocation("vertex");
		if (attributes.isEnabled(location) === false) {
			gl.enableVertexAttribArray(location);
		}
		attributes.enable(location);
		attributes.end(gl);
		this.vertexAttribPointer("vertex", 3);
		gl.drawArrays(gl.LINES, 0, count);
	}
}
