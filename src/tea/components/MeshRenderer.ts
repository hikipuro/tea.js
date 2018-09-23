import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

class BufferAttributes {
	stride: number;
	items: Array<BufferAttribute>;
	shader: Tea.Shader;

	constructor() {
		this.stride = 0;
		this.items = [];
	}

	clear(): void {
		this.items.splice(0, this.items.length);
	}

	add(name: string, size: number, type: number, offset: number): void {
		var location = this.shader.getAttribLocation(name);
		var attrib = new BufferAttribute();
		attrib.name = name;
		attrib.location = location;
		attrib.size = size;
		attrib.type = type;
		attrib.offset = offset;
		this.items.push(attrib);
	}
}

class BufferAttribute {
	name: string;
	location: number;
	size: number;
	type: number;
	offset: number;

	constructor() {
	}
}

export class MeshRenderer extends Renderer {
	receiveShadows: boolean;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	protected _mesh: Tea.Mesh;
	protected _bounds: Tea.Bounds;
	protected _wireframe: boolean;
	protected _draw: Function;
	protected _attributes: BufferAttributes;

	constructor(app: Tea.App) {
		super(app);
		this.receiveShadows = true;
		this._bounds = new Tea.Bounds();
		this._wireframe = false;
		this._draw = this.draw;
		this._attributes = new BufferAttributes();
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
	}

	get bounds(): Tea.Bounds {
		return this._bounds;
	}

	get wireframe(): boolean {
		return this._wireframe;
	}
	set wireframe(value: boolean) {
		this._wireframe = value;
		this._draw = this.getDrawFunc(this._mesh);
	}

	get mesh(): Tea.Mesh {
		return this._mesh;
	}

	destroy(): void {
		var gl = this.gl;
		if (this.vertexBuffer != null) {
			//gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);
			//gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		if (this.indexBuffer != null) {
			gl.deleteBuffer(this.indexBuffer);
			this.indexBuffer = undefined;
		}
		this.receiveShadows = undefined;
		this._mesh = undefined;
		this._bounds = undefined;
		this._wireframe = undefined;
		this._draw = undefined;
		this._attributes = undefined;
		super.destroy();
	}

	update(): void {
		var component = this.object3d.getComponent(Tea.MeshFilter);
		if (component != null && component.mesh != null) {
			var mesh = component.mesh;
			this._bounds.copy(mesh.bounds);
			var bounds = this._bounds;
			bounds.center.add$(this.object3d.position);
			
			var rotation = this.object3d.rotation;
			bounds.extents.applyQuaternion(rotation);
			var extents = bounds.extents;
			extents[0] = Math.abs(extents[0]);
			extents[1] = Math.abs(extents[1]);
			extents[2] = Math.abs(extents[2]);
			bounds.extents.scale$(this.object3d.scale);
			
			this._mesh = mesh;
			if (mesh instanceof Tea.TextMesh) {
				if (this.material != null) {
					this.material.color.copy(mesh.color);
				}
			}
			//this._bounds = bounds;
		} else {
			this._mesh = null;
			//this._bounds = null;
		}
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		if (this._mesh == null) {
			return;
		}
		super.render(camera, lights, renderSettings);

		var mesh = this._mesh;
		/*
		var location = this.material.shader.propertyToID("receiveShadows");
		if (location != null) {
			if (this.receiveShadows) {
				this.gl.uniform1i(location, 1);
			} else {
				this.gl.uniform1i(location, 0);
			}
		}
		*/
		if (mesh.isModified === true) {
			this.setMeshData(mesh);
		}
		this.setVertexBuffer(mesh);
		this.setFrontFace();
		this._draw(mesh);
		this.disableAllAttributes();
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

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	updateAttributes(): void {
		var gl = this.gl;
		var type = gl.FLOAT;
		var mesh = this._mesh;
		var stride = 4 * 3;
		this._attributes.clear();
		this._attributes.shader = this.material.shader;
		this._attributes.add("vertex", 3, type, 0);

		if (mesh.hasTriangles === false) {
			this._attributes.add("normal", 0, type, 0);
			this._attributes.add("texcoord", 0, type, 0);
			this._attributes.add("color", 0, type, 0);
			this._attributes.stride = stride;
			return;
		}
		if (mesh.hasNormals) {
			this._attributes.add("normal", 3, type, stride);
			stride += 4 * 3;
		} else {
			this._attributes.add("normal", 0, type, 0);
		}
		if (mesh.hasUVs) {
			this._attributes.add("texcoord", 2, type, stride);
			stride += 4 * 2;
		} else {
			this._attributes.add("texcoord", 0, type, 0);
		}
		if (mesh.hasColors) {
			this._attributes.add("color", 4, type, stride);
			stride += 4 * 4;
		} else {
			this._attributes.add("color", 0, type, 0);
		}
		this._attributes.stride = stride;

		/*
		var items = this._attributes.items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (item.location < 0) {
				continue;
			}
			if (item.size <= 0) {
				gl.disableVertexAttribArray(item.location);
				continue;
			}
			gl.enableVertexAttribArray(item.location);
		}
		*/
	}

	protected setMeshData(mesh: Tea.Mesh): void {
		if (mesh.vertices == null || mesh.vertices.length <= 0) {
			return;
		}
		var data = mesh.createVertexBufferData();

		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;

		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.STATIC_DRAW);
		//gl.bindBuffer(target, null);

		if (mesh.hasTriangles) {
			target = gl.ELEMENT_ARRAY_BUFFER;
			var triangles = null;
			if (this.app.status.OES_element_index_uint != null) {
				triangles = new Uint32Array(Tea.ArrayUtil.unroll(mesh.triangles));
			} else {
				triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
			}
			gl.bindBuffer(target, this.indexBuffer);
			gl.bufferData(target, triangles, gl.STATIC_DRAW);
			//gl.bindBuffer(target, null);
		}

		this.updateAttributes();
		this._draw = this.getDrawFunc(mesh);
		mesh.isModified = false;
	}

	protected setVertexBuffer(mesh: Tea.Mesh): void {
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		var stride = this._attributes.stride;
		var items = this._attributes.items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (item.location < 0) {
				continue;
			}
			if (item.size <= 0) {
				gl.disableVertexAttribArray(item.location);
				continue;
			}
			gl.enableVertexAttribArray(item.location);
			//console.log(gl.getError());
			gl.vertexAttribPointer(
				item.location,
				item.size,
				item.type,
				false,
				stride,
				item.offset
			);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		if (mesh.hasTriangles) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		} else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}

	protected disableAllAttributes(): void {
		var gl = this.gl;
		var items = this._attributes.items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (item.location < 0) {
				continue;
			}
			gl.disableVertexAttribArray(item.location);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	protected setFrontFace(): void {
		var gl = this.gl;
		var scale = this.object3d.scale;
		var status = this.app.status;
		var face = gl.CW;
		if (scale[0] * scale[1] * scale[2] < 0.0) {
			face = gl.CCW;
		}
		if (status.frontFace !== face) {
			gl.frontFace(face);
			status.frontFace = face;
		}
	}

	protected getDrawFunc(mesh: Tea.Mesh): Function {
		if (this.wireframe) {
			if (mesh.hasTriangles) {
				if (this.app.status.OES_element_index_uint != null) {
					return this.drawWireframe32;
				}
				return this.drawWireframe;
			}
			return this.drawArraysWireframe;
		}
		if (mesh.hasTriangles) {
			if (this.app.status.OES_element_index_uint != null) {
				return this.draw32;
			}
			return this.draw;
		}
		return this.drawArrays;
	}

	protected draw(mesh: Tea.Mesh): void {
		var gl = this.gl;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected draw32(mesh: Tea.Mesh): void {
		var gl = this.gl;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, 0);
	}

	protected drawArrays(mesh: Tea.Mesh): void {
		var gl = this.gl;
		gl.drawArrays(
			gl.TRIANGLES, 0, mesh.vertices.length
		);
	}

	protected drawWireframe(mesh: Tea.Mesh): void {
		var gl = this.gl;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected drawWireframe32(mesh: Tea.Mesh): void {
		var gl = this.gl;
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_INT, 0);
	}

	protected drawArraysWireframe(mesh: Tea.Mesh): void {
		var gl = this.gl;
		gl.drawArrays(
			gl.LINES, 0, mesh.vertices.length
		);
	}
}
