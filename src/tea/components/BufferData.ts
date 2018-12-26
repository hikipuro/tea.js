import * as Tea from "../Tea";

class BufferAttributes {
	stride: number;
	items: Array<BufferAttribute>;

	constructor() {
		this.stride = 0;
		this.items = [];
	}

	clear(): void {
		this.items.splice(0, this.items.length);
	}

	add(name: string, size: number, type: number, offset: number): void {
		var attrib = new BufferAttribute();
		attrib.name = name;
		attrib.size = size;
		attrib.type = type;
		attrib.offset = offset;
		this.items.push(attrib);
	}
}

class BufferAttribute {
	name: string;
	size: number;
	type: number;
	offset: number;
}

export class BufferData {
	app: Tea.App;
	gl: WebGLRenderingContext;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	protected _mesh: Tea.Mesh;
	protected _hasIndices: boolean;
	protected _has32BitIndices: boolean;
	protected _vertexCount: number;
	protected _triangleCount: number;
	protected _attributes: BufferAttributes;

	constructor(app: Tea.App) {
		this.app = app;
		this.gl = app.gl;
		this._mesh = null;
		this._hasIndices = false;
		this._has32BitIndices = false;
		this._vertexCount = 0;
		this._triangleCount = 0;
		this._attributes = new BufferAttributes();
		this.createBuffers();
		//var gl = this.gl;
		//console.log(gl.ARRAY_BUFFER.toString(16));
		//console.log(gl.ELEMENT_ARRAY_BUFFER.toString(16));
	}

	get hasIndices(): boolean {
		return this._hasIndices;
	}

	get has32BitIndices(): boolean {
		return this._has32BitIndices;
	}

	get vertexCount(): number {
		return this._vertexCount;
	}

	get triangleCount(): number {
		return this._triangleCount;
	}

	destroy(): void {
		this.app = undefined;
		this._hasIndices = undefined;
		this._has32BitIndices = undefined;
		this._vertexCount = undefined;
		this._triangleCount = undefined;
		this._attributes = undefined;
		var gl = this.gl;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		if (this.indexBuffer != null) {
			gl.deleteBuffer(this.indexBuffer);
			this.indexBuffer = undefined;
		}
	}

	bindBuffers(): void {
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		var indexBuffer = null;
		if (this._hasIndices) {
			indexBuffer = this.indexBuffer;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	}

	unbindBuffers(): void {
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	clearBuffers(): void {
		this.clearVertexBuffer();
		this.clearIndexBuffer();
	}

	setMeshData(mesh: Tea.Mesh): void {
		this._mesh = mesh;
		if (this.isValidMesh(mesh) === false) {
			this.clearBuffers();
			return;
		}
		this.setVertexBufferData(mesh);
		this.setIndexBufferData(mesh);
		this.updateAttributes();
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

	setBuffers(shader: Tea.Shader): void {
		if (shader == null) {
			return;
		}
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		var attributes = Tea.Renderer.attributes;
		var stride = this._attributes.stride;
		var items = this._attributes.items;
		var length = items.length;
		//var locations = [];
		//attributes.start();
		for (var i = 0; i < length; i++) {
			var item = items[i];
			var location = shader.getAttribLocation(item.name);
			if (location < 0) {
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
			if (attributes.isEnabled(location) === false) {
				gl.enableVertexAttribArray(location);
			}
			attributes.enable(location);
			//console.log(gl.getError());
			gl.vertexAttribPointer(
				location,
				item.size,
				item.type,
				false,
				stride,
				item.offset
			);
		}

		attributes.end(gl);
		//gl.bindBuffer(gl.ARRAY_BUFFER, null);

		if (this._hasIndices) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		} else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}

	protected createBuffers(): void {
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
	}

	protected isValidMesh(mesh: Tea.Mesh): boolean {
		return (
			mesh != null &&
			mesh.vertices != null &&
			mesh.vertices.length > 0
		);
	}

	protected clearVertexBuffer(): void {
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, null, gl.STATIC_DRAW);
		gl.bindBuffer(target, null);
		this._vertexCount = 0;
	}

	protected clearIndexBuffer(): void {
		var gl = this.gl;
		var target = gl.ELEMENT_ARRAY_BUFFER;
		gl.bindBuffer(target, this.indexBuffer);
		gl.bufferData(target, null, gl.STATIC_DRAW);
		gl.bindBuffer(target, null);
		this._triangleCount = 0;
	}

	protected setVertexBufferData(mesh: Tea.Mesh): void {
		var gl = this.gl;
		var data = mesh.createVertexBufferData();
		this._vertexCount = mesh.vertexCount;
		var target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.STATIC_DRAW);
		gl.bindBuffer(target, null);
	}

	protected setIndexBufferData(mesh: Tea.Mesh): void {
		if (mesh.hasTriangles === false) {
			this._hasIndices = false;
			this._has32BitIndices = false;
			this.clearIndexBuffer();
			return;
		}
		this._hasIndices = true;
		this._triangleCount = mesh.triangles.length;
		var triangles = null;
		var array = Tea.ArrayUtil.unroll(mesh.triangles);
		if (mesh.vertices.length > 0xFFFF) {
			this._has32BitIndices = true;
			triangles = new Uint32Array(array);
		} else {
			this._has32BitIndices = false;
			triangles = new Uint16Array(array);
		}
		var gl = this.gl;
		var target = gl.ELEMENT_ARRAY_BUFFER;
		gl.bindBuffer(target, this.indexBuffer);
		gl.bufferData(target, triangles, gl.STATIC_DRAW);
		gl.bindBuffer(target, null);
	}
}
