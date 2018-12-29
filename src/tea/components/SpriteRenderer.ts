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
		var location = -1;
		if (this.shader != null) {
			location = this.shader.getAttribLocation(name);
		}
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

export class SpriteRenderer extends Renderer {
	static readonly className: string = "SpriteRenderer";
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	mvpMatrix: Tea.Matrix4x4;
	protected _mesh: Tea.Mesh;
	protected _bounds: Tea.Bounds;
	protected _wireframe: boolean;
	protected _draw: Function;
	protected _attributes: BufferAttributes;
	protected _frontFace: number;

	constructor(app: Tea.App) {
		super(app);
		this._bounds = new Tea.Bounds();
		this._wireframe = false;
		this._draw = this.draw;
		this._attributes = new BufferAttributes();
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.mvpMatrix = Tea.Matrix4x4.identity.clone();
		this._frontFace = gl.CCW;
	}

	get bounds(): Tea.Bounds {
		if (this._mesh == null) {
			return null;
		}
		this._bounds.copy(this._mesh.bounds);
		var bounds = this._bounds;
		bounds.center.addSelf(this.object3d.position);
		
		var rotation = this.object3d.rotation;
		bounds.extents.applyQuaternion(rotation);
		var extents = bounds.extents;
		extents[0] = Math.abs(extents[0]);
		extents[1] = Math.abs(extents[1]);
		extents[2] = Math.abs(extents[2]);
		bounds.extents.scaleSelf(this.object3d.scale);
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
			this._mesh = component.mesh;
		} else {
			this._mesh = null;
		}
	}

	render2d(): void {
		if (!this.isRenderable) {
			return;
		}
		//super.render(camera, lights, renderSettings);
		var shader = this.material.shader;
		if (shader == null) {
			return;
		}
		this.gl.useProgram(this.material.shader.program);
		this.setShaderSettings();
		this.setIntrinsicUniforms(null);
		this.setMaterialUniforms();
		this.setTextures();

		var mesh = this._mesh;
		if (mesh.isModified === true) {
			this.setMeshData(mesh);
		}
		this.setVertexBuffer(mesh);
		this.setFrontFace();
		this._draw(mesh);
		//this.disableAllAttributes();
		Renderer.drawCallCount++;
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = SpriteRenderer.className;
		json.wireframe = this._wireframe;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, SpriteRenderer.className) === false) {
			callback(null);
			return;
		}
		var renderer = new SpriteRenderer(app);
		renderer.enabled = json.enabled;
		renderer._wireframe = json.wireframe;
		renderer.material = Tea.Material.fromJSON(app, json.material);
		//meshRenderer.material.shader = Tea.Shader.fromJSON(app, json);
		callback(renderer);
	}

	protected get isRenderable(): boolean {
		return (
			this.enabled &&
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this._mesh != null
		);
	}

	updateAttributes(): void {
		var mesh = this._mesh;
		if (mesh == null) {
			return;
		}

		var gl = this.gl;
		var type = gl.FLOAT;
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
			if (mesh.vertices.length > 0xFFFF) {
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
		var attributes = Renderer.attributes;
		var stride = this._attributes.stride;
		var items = this._attributes.items;
		var length = items.length;
		//var locations = [];
		//attributes.start();
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (item.location < 0) {
				continue;
			}
			if (item.size <= 0) {
				//if (attributes.isEnabled(item.location)) {
				//	gl.disableVertexAttribArray(item.location);
				//	attributes.set(item.location, false);
				//}
				continue;
			}
			//locations.push(item.location);
			if (attributes.isEnabled(item.location) === false) {
				gl.enableVertexAttribArray(item.location);
			}
			attributes.enable(item.location);
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

		attributes.end(gl);
		//gl.bindBuffer(gl.ARRAY_BUFFER, null);

		if (mesh.hasTriangles) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		} else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
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

	protected setIntrinsicUniforms(camera: Tea.Camera): void {
		var gl = this.gl;
		var shader = this.material.shader;
		var model = this.object3d.localToWorldMatrix;
		var inverseModel = this.object3d.worldToLocalMatrix;
		var identity = Tea.Matrix4x4.identity;
		var location: WebGLUniformLocation = null;

		location = shader.getUniformLocation("TEA_MATRIX_V");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, identity);
		}
		location = shader.getUniformLocation("TEA_MATRIX_I_V");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, identity);
		}
		location = shader.getUniformLocation("TEA_MATRIX_P");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, identity);
		}
		location = shader.getUniformLocation("TEA_OBJECT_TO_WORLD");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, model);
		}
		location = shader.getUniformLocation("TEA_WORLD_TO_OBJECT");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, inverseModel);
		}
		location = shader.getUniformLocation("TEA_MATRIX_VP");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, identity);
		}

		location = shader.getUniformLocation("TEA_MATRIX_MV");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, identity);
		}

		location = shader.getUniformLocation("TEA_MATRIX_MVP");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, this.mvpMatrix);
		}
	}
}
