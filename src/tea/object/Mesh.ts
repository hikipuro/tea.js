import * as Tea from "../Tea";

export class Mesh {
	vertices: Float32Array;
	triangles: Uint16Array;
	normals: Float32Array;
	uv: Float32Array;
	colors: Float32Array;

	bounds: Tea.Bounds;

	constructor() {
		this.clear();
	}

	get vertexCount(): number {
		const vertices = this.vertices;
		if (vertices == null) {
			return 0;
		}
		return Math.floor(vertices.length / 3);
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
		this.vertices = new Float32Array([]);
		this.triangles = new Uint16Array([]);
		this.normals = new Float32Array([]);
		this.uv = new Float32Array([]);
		this.colors = new Float32Array([]);
		this.bounds = new Tea.Bounds();
	}

	setVertices(array: Array<number>): void {
		if (array == null) {
			this.vertices = new Float32Array([]);
			return;
		}
		this.vertices = new Float32Array(array);
	}

	setTriangles(array: Array<number>): void {
		if (array == null) {
			this.triangles = new Uint16Array([]);
			return;
		}
		this.triangles = new Uint16Array(array);
	}

	setNormals(array: Array<number>): void {
		if (array == null) {
			this.normals = new Float32Array([]);
			return;
		}
		this.normals = new Float32Array(array);
	}

	setUVs(array: Array<number>): void {
		if (array == null) {
			this.uv = new Float32Array([]);
			return;
		}
		this.uv = new Float32Array(array);
	}

	setColors(array: Array<number>): void {
		if (array == null) {
			this.colors = new Float32Array([]);
			return;
		}
		this.colors = new Float32Array(array);
	}

	scale(value: number): void {
		const vertices = this.vertices;
		const length = vertices.length;
		for (let i = 0; i < length; i++) {
			vertices[i] *= value;
		}
	}

	rotateX(radian: number): void {
		const vertices = this.vertices;
		for (let i = 0; i < vertices.length; i += 3) {
			const y = vertices[i + 1];
			const z = vertices[i + 2];
			const sin = Math.sin(radian);
			const cos = Math.cos(radian);
			vertices[i + 1] = cos * y + -sin * z;
			vertices[i + 2] = sin * y + cos * z;
		}
	}
}
