import * as Tea from "../Tea";

export class Mesh {
	static readonly className: string = "Mesh";
	vertices: Array<Tea.Vector3>;
	triangles: Array<Tea.Vector3>;
	normals: Array<Tea.Vector3>;
	uv: Array<Tea.Vector2>;
	colors: Array<Tea.Color>;

	name: string;
	bounds: Tea.Bounds;
	isModified: boolean;
	isPrimitive: boolean;
	primitiveType: Tea.PrimitiveType;

	constructor() {
		this.clear();
	}

	static createPrimitive(type: Tea.PrimitiveType): Mesh {
		switch (type) {
			case Tea.PrimitiveType.Sphere:
				return Tea.Primitives.createSphereMesh(10, 10);
			case Tea.PrimitiveType.Capsule:
				return Tea.Primitives.createCapsuleMesh(10, 10);
			case Tea.PrimitiveType.Cylinder:
				return Tea.Primitives.createCylinderMesh(20);
			case Tea.PrimitiveType.Cube:
				return Tea.Primitives.createCubeMesh();
			case Tea.PrimitiveType.Plane:
				return Tea.Primitives.createPlaneMesh(10);
			case Tea.PrimitiveType.Quad:
				return Tea.Primitives.createQuadMesh();
		}
		return null;
	}

	get vertexCount(): number {
		if (this.vertices == null) {
			return 0;
		}
		return this.vertices.length;
	}

	get vertexBufferCount(): number {
		var count = 0;
		var vertices = this.vertices;
		var normals = this.normals;
		var uv = this.uv;

		if (vertices != null && vertices.length > 0) {
			count++;
		}
		if (normals != null && normals.length > 0) {
			count++;
		}
		if (uv != null && uv.length > 0) {
			count++;
		}
		return count;
	}

	get hasTriangles(): boolean {
		return this.triangles != null
			&& this.triangles.length > 0;
	}

	get hasNormals(): boolean {
		return this.normals != null
			&& this.normals.length > 0;
	}

	get hasColors(): boolean {
		return this.colors != null
			&& this.colors.length > 0;
	}

	get hasUVs(): boolean {
		return this.uv != null
			&& this.uv.length > 0;
	}

	destroy(): void {
		this.vertices = undefined;
		this.triangles = undefined;
		this.normals = undefined;
		this.uv = undefined;
		this.colors = undefined;
		this.bounds = undefined;
		this.isModified = undefined;
	}

	clear(): void {
		this.vertices = [];
		this.triangles = [];
		this.normals = [];
		this.uv = [];
		this.colors = [];
		this.name = "";
		this.bounds = new Tea.Bounds();
		this.isModified = true;
		this.isPrimitive = false;
		this.primitiveType = Tea.PrimitiveType.Null;
	}

	clone(): Mesh {
		var mesh = new Mesh();
		for (var i = 0; i < this.vertices.length; i++) {
			mesh.vertices.push(this.vertices[i].clone());
		}
		for (var i = 0; i < this.triangles.length; i++) {
			mesh.triangles.push(this.triangles[i].clone());
		}
		for (var i = 0; i < this.normals.length; i++) {
			mesh.normals.push(this.normals[i].clone());
		}
		for (var i = 0; i < this.uv.length; i++) {
			mesh.uv.push(this.uv[i].clone());
		}
		for (var i = 0; i < this.colors.length; i++) {
			mesh.colors.push(this.colors[i].clone());
		}
		mesh.bounds = this.bounds.clone();
		mesh.isModified = true;
		mesh.isPrimitive = this.isPrimitive;
		mesh.primitiveType = this.primitiveType;
		return mesh;
	}

	setVertices(array: Array<number>): void {
		this.vertices = this.convertToVec3Array(array);
	}

	setTriangles(array: Array<number>): void {
		this.triangles = this.convertToVec3Array(array);
	}

	setNormals(array: Array<number>): void {
		this.normals = this.convertToVec3Array(array);
	}

	setUVs(array: Array<number>): void {
		this.uv = this.convertToVec2Array(array);
	}

	setColors(array: Array<number>): void {
		this.colors = this.convertToColorArray(array);
	}

	uploadMeshData(): void {
		this.isModified = true;
	}

	scale(value: number): void {
		var vertices = this.vertices;
		var length = vertices.length;
		for (var i = 0; i < length; i++) {
			vertices[i].mulSelf(value);
		}
	}

	rotateX(radian: number): void {
		var sin = Math.sin(radian);
		var cos = Math.cos(radian);
		var vertices = this.vertices;
		var length = vertices.length;
		for (var i = 0; i < length; i++) {
			var y = vertices[i].y;
			var z = vertices[i].z;
			vertices[i].y = cos * y + -sin * z;
			vertices[i].z = sin * y + cos * z;
		}
	}

	calculateBounds(): void {
		var positions = this.vertices;
		if (positions == null || positions.length <= 0) {
			return;
		}
		var min = new Tea.Vector3();
		var max = new Tea.Vector3();
		var length = positions.length;
		for (var i = 0; i < length; i++) {
			var position = positions[i];
			if (position == null) {
				continue;
			}
			if (position[0] < min[0]) {
				min[0] = position[0];
			}
			if (position[1] < min[1]) {
				min[1] = position[1];
			}
			if (position[2] < min[2]) {
				min[2] = position[2];
			}
			if (position[0] > max[0]) {
				max[0] = position[0];
			}
			if (position[1] > max[1]) {
				max[1] = position[1];
			}
			if (position[2] > max[2]) {
				max[2] = position[2];
			}
		}
		var size = max.sub(min);
		var extents = size.div(2);
		var bounds = new Tea.Bounds();
		bounds.extents = extents;
		bounds.center = min.add(extents);
		this.bounds = bounds;
	}

	calculateNormals(): void {
		if (this.hasTriangles === false) {
			return;
		}
		var vertices = this.vertices;
		var triangles = this.triangles;
		var length = vertices.length;
		var normals: Array<Tea.Vector3> = new Array(length);
		for (var i = 0; i < length; i++) {
			normals[i] = new Tea.Vector3();
		}
		length = triangles.length;
		for (var i = 0; i < length; i++) {
			var triangle = triangles[i];
			if (triangle == null) {
				continue;
			}
			var x = triangle[0];
			var y = triangle[1];
			var z = triangle[2];
			var v0 = vertices[x];
			var v1 = vertices[y];
			var v2 = vertices[z];
			var n = v1.sub(v0).cross(v2.sub(v1));
			normals[x].addSelf(n);
			normals[y].addSelf(n);
			normals[z].addSelf(n);
		}
		length = normals.length;
		for (var i = 0; i < length; i++) {
			normals[i].normalizeSelf();
		}
		this.normals = normals;
	}

	createVertexBufferData(): Float32Array {
		var stride = 4 * 3;
		if (this.hasTriangles) {
			if (this.hasNormals) {
				stride += 4 * 3;
			}
			if (this.hasUVs) {
				stride += 4 * 2;
			}
			if (this.hasColors) {
				stride += 4 * 4;
			}
		}

		var length = this.vertexCount;
		var data = new DataView(new ArrayBuffer(stride * length));
		var offset = -4;
		for (var i = 0; i < length; i++) {
			var vertex = this.vertices[i];
			data.setFloat32(offset += 4, vertex[0], true);
			data.setFloat32(offset += 4, vertex[1], true);
			data.setFloat32(offset += 4, vertex[2], true);
			if (this.hasTriangles === false) {
				continue;
			}
			if (this.hasNormals) {
				var normal = this.normals[i];
				if (normal == null) {
					data.setFloat32(offset += 4, 0.0, true);
					data.setFloat32(offset += 4, 0.0, true);
					data.setFloat32(offset += 4, 0.0, true);
				} else {
					data.setFloat32(offset += 4, normal[0], true);
					data.setFloat32(offset += 4, normal[1], true);
					data.setFloat32(offset += 4, normal[2], true);
				}
			}
			if (this.hasUVs) {
				var uv = this.uv[i];
				if (uv == null) {
					data.setFloat32(offset += 4, 0.0, true);
					data.setFloat32(offset += 4, 0.0, true);
				} else {
					data.setFloat32(offset += 4, uv[0], true);
					data.setFloat32(offset += 4, uv[1], true);
				}
			}
			if (this.hasColors) {
				var color = this.colors[i];
				data.setFloat32(offset += 4, color[0], true);
				data.setFloat32(offset += 4, color[1], true);
				data.setFloat32(offset += 4, color[2], true);
				data.setFloat32(offset += 4, color[3], true);
			}
		}
		return new Float32Array(data.buffer, 0);
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Mesh.className);
		json.isPrimitive = this.isPrimitive;
		json.primitiveType = Tea.PrimitiveType.toString(this.primitiveType);
		return json;
	}

	static fromJSON(app: Tea.App, json: any): Mesh {
		if (Tea.JSONUtil.isValidSceneJSON(json, Mesh.className) === false) {
			return null;
		}
		if (json.isPrimitive) {
			var type = Tea.PrimitiveType[json.primitiveType as string];
			var mesh = Mesh.createPrimitive(type);
			mesh.isPrimitive = true;
			return mesh;
		}
		var mesh = new Mesh();
		return mesh;
	}

	protected convertToVec2Array(array: Array<number>): Array<Tea.Vector2> {
		if (array == null || array.length <= 0) {
			return [];
		}
		var a = [];
		var length = Math.floor(array.length / 2) * 2;
		for (var i = 0; i < length; i += 2) {
			var item = new Tea.Vector2(
				array[i], array[i + 1]
			);
			a.push(item);
		}
		return a;
	}

	protected convertToVec3Array(array: Array<number>): Array<Tea.Vector3> {
		if (array == null || array.length <= 0) {
			return [];
		}
		var a = [];
		var length = Math.floor(array.length / 3) * 3;
		for (var i = 0; i < length; i += 3) {
			var x = array[i];
			var y = array[i + 1];
			var z = array[i + 2];
			var item = new Tea.Vector3(x, y, z);
			a.push(item);
		}
		return a;
	}

	protected convertToColorArray(array: Array<number>): Array<Tea.Color> {
		if (array == null || array.length <= 0) {
			return [];
		}
		var a = [];
		var length = Math.floor(array.length / 4) * 4;
		for (var i = 0; i < length; i += 4) {
			var item = new Tea.Color(
				array[i], array[i + 1], array[i + 2], array[i + 3]
			);
			a.push(item);
		}
		return a;
	}
}
