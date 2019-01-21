import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
	static readonly className: string = "MeshRenderer";
	receiveShadows: boolean;
	protected _meshFilter: Tea.MeshFilter;
	protected _bounds: Tea.Bounds;
	protected _wireframe: boolean;
	protected _frontFace: number;

	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this.receiveShadows = true;
		this._meshFilter = null;
		this._bounds = null;
		this._wireframe = false;
		this._frontFace = gl.CCW;
	}

	get bounds(): Tea.Bounds {
		var object3d = this.object3d;
		if (object3d == null) {
			return null;
		}
		if (this._bounds != null) {
			return this._bounds;
		}
		var position = object3d.position;
		var rotation = object3d.rotation;
		var scale = object3d.scale;

		//var bounds = this._bounds;
		var bounds = new Tea.Bounds();
		if (this._meshFilter.mesh != null) {
			//bounds.copy(this._meshFilter.mesh.bounds);
			var meshBounds = this._meshFilter.mesh.bounds;
			var c = bounds.center;
			var e = bounds.extents;
			var vc = meshBounds.center;
			var ve = meshBounds.extents;
			c[0] = vc[0];
			c[1] = vc[1];
			c[2] = vc[2];
			e[0] = ve[0];
			e[1] = ve[1];
			e[2] = ve[2];
		}
		var center = bounds.center;
		var extents = bounds.extents;
		center[0] *= scale[0];
		center[1] *= scale[1];
		center[2] *= scale[2];
		center.applyQuaternion(rotation);
		center[0] += position[0];
		center[1] += position[1];
		center[2] += position[2];
		
		var min = Tea.Vector3.positiveInfinity.clone();
		var max = Tea.Vector3.negativeInfinity.clone();
		for (var i = 0; i < 8; i++) {
			var point = bounds.getPoint(i);
			point[0] = point[0] * scale[0] - center[0];
			point[1] = point[1] * scale[1] - center[1];
			point[2] = point[2] * scale[2] - center[2];
			point.applyQuaternion(rotation);
			if (min[0] > point[0]) {
				min[0] = point[0];
			} else if (max[0] < point[0]) {
				max[0] = point[0];
			}
			if (min[1] > point[1]) {
				min[1] = point[1];
			} else if (max[1] < point[1]) {
				max[1] = point[1];
			}
			if (min[2] > point[2]) {
				min[2] = point[2];
			} else if (max[2] < point[2]) {
				max[2] = point[2];
			}
		}
		extents[0] = (max[0] - min[0]) * 0.5;
		extents[1] = (max[1] - min[1]) * 0.5;
		extents[2] = (max[2] - min[2]) * 0.5;
		this._bounds = bounds;
		return bounds;
	}

	get wireframe(): boolean {
		return this._wireframe;
	}
	set wireframe(value: boolean) {
		this._wireframe = value;
	}

	get mesh(): Tea.Mesh {
		return this._meshFilter.mesh;
	}
	//set mesh(value: Tea.Mesh) {
	//	this._mesh = value;
	//}

	destroy(): void {
		this.receiveShadows = undefined;
		this._meshFilter = undefined;
		this._bounds = undefined;
		this._wireframe = undefined;
		super.destroy();
	}

	update(): void {
		var object3d = this.object3d;
		if (object3d == null) {
			return;
		}
		if (object3d.isMoved) {
			this._bounds = null;
		}
		var component = object3d.getComponent(Tea.MeshFilter);
		if (component == null) {
			this._meshFilter = null;
			return;
		}
		component.createData();
		this._meshFilter = component;
		//this._bounds = null;
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (camera == null) {
			return;
		}
		if (!this.isRenderable) {
			return;
		}
		super.render(camera, lights, renderSettings);
		var meshFilter = this._meshFilter;
		var bufferData = meshFilter.mesh.bufferData;
		bufferData.setBuffers(this.material.shader);
		this.setFrontFace();
		var draw = this.getDrawFunc(this._meshFilter.mesh);
		draw.apply(this);
		//this.disableAllAttributes();
		Renderer.drawCallCount++;
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = MeshRenderer.className;
		json.receiveShadows = this.receiveShadows;
		json.wireframe = this._wireframe;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, MeshRenderer.className) === false) {
			callback(null);
			return;
		}
		var meshRenderer = new MeshRenderer(app);
		meshRenderer.enabled = json.enabled;
		meshRenderer.receiveShadows = json.receiveShadows;
		meshRenderer._wireframe = json.wireframe;
		Tea.Material.fromJSON(app, json.material, (material: Tea.Material) => {
			if (material == null) {
				callback(meshRenderer);
				return;
			}
			meshRenderer.material = material;
			callback(meshRenderer);
		});
		//meshRenderer.material.shader = Tea.Shader.fromJSON(app, json);
	}

	protected get isRenderable(): boolean {
		return (
			this.enabled &&
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this._meshFilter != null &&
			this._meshFilter.mesh != null &&
			this._meshFilter.mesh.vertices != null
		);
	}

	protected disableAllAttributes(): void {
		var gl = this.gl;
		/*
		var items = this._attributes.items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (item.location < 0) {
				continue;
			}
			gl.disableVertexAttribArray(item.location);
		}
		*/
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	protected setFrontFace(): void {
		if (this.object3d.isMoved === false) {
			this.app.status.setFrontFace(this._frontFace);
			return;
		}
		var gl = this.gl;
		var scale = this.object3d.scale;
		if (scale[0] * scale[1] * scale[2] < 0.0) {
			this._frontFace = gl.CW;
		} else {
			this._frontFace = gl.CCW;
		}
		this.app.status.setFrontFace(this._frontFace);
	}

	protected getDrawFunc(mesh: Tea.Mesh): Function {
		if (mesh == null) {
			return this.draw;
		}
		var use32BitIndex = false;
		use32BitIndex = mesh.vertices.length > 0xFFFF &&
			this.app.status.OES_element_index_uint != null;
		if (this.wireframe) {
			if (mesh.hasTriangles) {
				if (use32BitIndex) {
					return this.drawWireframe32;
				}
				return this.drawWireframe;
			}
			return this.drawArraysWireframe;
		}
		if (mesh.hasTriangles) {
			if (use32BitIndex) {
				return this.draw32;
			}
			return this.draw;
		}
		return this.drawArrays;
	}

	protected draw(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.triangleCount * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected draw32(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.triangleCount * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, 0);
	}

	protected drawArrays(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.vertexCount;
		gl.drawArrays(gl.TRIANGLES, 0, count);
	}

	protected drawArraysWireframe(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.vertexCount;
		gl.drawArrays(gl.LINES, 0, count);
	}

	protected drawWireframe(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.triangleCount * 3;
		gl.drawElements(gl.LINE_STRIP, count, gl.UNSIGNED_SHORT, 0);
	}

	protected drawWireframe32(): void {
		var gl = this.gl;
		var count = this._meshFilter.mesh.triangleCount * 3;
		gl.drawElements(gl.LINE_STRIP, count, gl.UNSIGNED_INT, 0);
	}
}
