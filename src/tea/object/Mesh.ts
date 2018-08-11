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
		let count = 0;
		const vertices = this.vertices;
		const normals = this.normals;
		const uv = this.uv;

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
		const vertices = this.vertices;
		const length = vertices.length;
		for (let i = 0; i < length; i++) {
			vertices[i].mul(value);
		}
	}

	rotateX(radian: number): void {
		const sin = Math.sin(radian);
		const cos = Math.cos(radian);
		const vertices = this.vertices;
		const length = vertices.length;
		for (let i = 0; i < length; i++) {
			const y = vertices[i].y;
			const z = vertices[i].z;
			vertices[i].y = cos * y + -sin * z;
			vertices[i].z = sin * y + cos * z;
		}
	}

	protected convertToVec2Array(array: Array<number>): Array<Tea.Vector2> {
		if (array == null || array.length <= 0) {
			return [];
		}
		const a = [];
		const length = Math.floor(array.length / 2) * 2;
		for (let i = 0; i < length; i += 2) {
			const item = new Tea.Vector2(
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
		const a = [];
		const length = Math.floor(array.length / 3) * 3;
		for (let i = 0; i < length; i += 3) {
			const item = new Tea.Vector3(
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
		const a = [];
		const length = Math.floor(array.length / 4) * 4;
		for (let i = 0; i < length; i += 4) {
			const item = new Tea.Color(
				array[i], array[i + 1], array[i + 2], array[i + 3]
			);
			a.push(item);
		}
		return a;
	}
}
