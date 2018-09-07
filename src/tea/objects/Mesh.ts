import * as Tea from "../Tea";

export class Mesh {
	vertices: Array<Tea.Vector3>;
	triangles: Array<Tea.Vector3>;
	normals: Array<Tea.Vector3>;
	uv: Array<Tea.Vector2>;
	colors: Array<Tea.Color>;

	bounds: Tea.Bounds;
	isModified: boolean;

	constructor() {
		this.clear();
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

	clear(): void {
		this.vertices = [];
		this.triangles = [];
		this.normals = [];
		this.uv = [];
		this.colors = [];
		this.bounds = new Tea.Bounds();
		this.isModified = true;
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
			vertices[i].mul$(value);
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
			return null;
		}
		var min = new Tea.Vector3();
		var max = new Tea.Vector3();
		var length = positions.length;
		for (var i = 0; i < length; i++) {
			var position = positions[i];
			if (position == null) {
				continue;
			}
			if (position.x < min.x) {
				min.x = position.x;
			}
			if (position.y < min.y) {
				min.y = position.y;
			}
			if (position.z < min.z) {
				min.z = position.z;
			}
			if (position.x > max.x) {
				max.x = position.x;
			}
			if (position.y > max.y) {
				max.y = position.y;
			}
			if (position.z > max.z) {
				max.z = position.z;
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
			var x = triangle.x;
			var y = triangle.y;
			var z = triangle.z;
			var v0 = vertices[x];
			var v1 = vertices[y];
			var v2 = vertices[z];
			var n = v1.sub(v0).cross(v2.sub(v1));
			normals[x].add$(n);
			normals[y].add$(n);
			normals[z].add$(n);
		}
		length = normals.length;
		for (var i = 0; i < length; i++) {
			normals[i].normalize$();
		}
		this.normals = normals;
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
			var item = new Tea.Vector3(
				array[i], array[i + 1], array[i + 2]
			);
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
