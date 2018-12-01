import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
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
		this._bounds = new Tea.Bounds();
		this._wireframe = false;
		this._frontFace = gl.CCW;
	}

	get bounds(): Tea.Bounds {
		if (this._meshFilter.mesh == null) {
			return null;
		}
		this._bounds.copy(this._meshFilter.mesh.bounds);
		var bounds = this._bounds;
		bounds.center.add$(this.object3d.position);
		
		var rotation = this.object3d.rotation;
		bounds.extents.applyQuaternion(rotation);
		var extents = bounds.extents;
		extents[0] = Math.abs(extents[0]);
		extents[1] = Math.abs(extents[1]);
		extents[2] = Math.abs(extents[2]);
		bounds.extents.scale$(this.object3d.scale);
		return this._bounds;
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
		if (this.object3d == null) {
			return;
		}
		var component = this.object3d.getComponent(Tea.MeshFilter);
		if (component == null) {
			this._meshFilter = null;
			return;
		}
		component.createData();
		this._meshFilter = component;
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
		meshFilter.data.setBuffers(this.material.shader);
		this.setFrontFace();
		var draw = this.getDrawFunc(this._meshFilter.mesh);
		draw.apply(this);
		//this.disableAllAttributes();
		Renderer.drawCallCount++;
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "MeshRenderer",
			receiveShadows: this.receiveShadows,
			wireframe: this._wireframe
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): MeshRenderer {
		if (json == null || json._type !== "MeshRenderer") {
			return null;
		}
		var meshRenderer = new MeshRenderer(app);
		meshRenderer.enabled = json.enabled;
		meshRenderer.receiveShadows = json.receiveShadows;
		meshRenderer._wireframe = json.wireframe;
		meshRenderer.material = Tea.Material.fromJSON(app, json.material);
		//meshRenderer.material.shader = Tea.Shader.fromJSON(app, json);
		return meshRenderer;
	}

	protected get isRenderable(): boolean {
		return (
			this.enabled &&
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this._meshFilter != null &&
			this._meshFilter.mesh != null
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
		var mesh = this._meshFilter.mesh;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected draw32(): void {
		var gl = this.gl;
		var mesh = this._meshFilter.mesh;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, 0);
	}

	protected drawArrays(): void {
		var gl = this.gl;
		var mesh = this._meshFilter.mesh;
		gl.drawArrays(
			gl.TRIANGLES, 0, mesh.vertices.length
		);
	}

	protected drawWireframe(): void {
		var gl = this.gl;
		var mesh = this._meshFilter.mesh;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected drawWireframe32(): void {
		var gl = this.gl;
		var mesh = this._meshFilter.mesh;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_INT, 0);
	}

	protected drawArraysWireframe(): void {
		var gl = this.gl;
		var mesh = this._meshFilter.mesh;
		gl.drawArrays(
			gl.LINES, 0, mesh.vertices.length
		);
	}
}
