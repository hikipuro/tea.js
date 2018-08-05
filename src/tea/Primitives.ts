import { Mesh } from "./object/Mesh";

export class Primitives {
	static createPlainMesh(): Mesh {
		const vertices = [
			-0.5, -0.5, 0,
			 0.5, -0.5, 0,
			 0.5,  0.5, 0,
			-0.5,  0.5, 0
		];
		const triangles = [
			0, 1, 2,
			0, 2, 3
		];
		const uv = [
			0, 1,
			1, 1,
			1, 0,
			0, 0,
		];
		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setUVs(uv);
		return mesh;
	}

	static createCubeMesh(): Mesh {
		const vertices = [
			// front
			 0.5,  0.5, 0.5,
			-0.5,  0.5, 0.5,
			-0.5, -0.5, 0.5,
			 0.5, -0.5, 0.5,
			// back
			-0.5,  0.5, -0.5,
			 0.5,  0.5, -0.5,
			 0.5, -0.5, -0.5,
			-0.5, -0.5, -0.5,
			// top
			 0.5, 0.5, -0.5,
			-0.5, 0.5, -0.5,
			-0.5, 0.5,  0.5,
			 0.5, 0.5,  0.5,
			// bottom
			-0.5, -0.5, -0.5,
			 0.5, -0.5, -0.5,
			 0.5, -0.5,  0.5,
			-0.5, -0.5,  0.5,
			// left
			-0.5,  0.5,  0.5,
			-0.5,  0.5, -0.5,
			-0.5, -0.5, -0.5,
			-0.5, -0.5,  0.5,
			// right
			0.5,  0.5, -0.5,
			0.5,  0.5,  0.5,
			0.5, -0.5,  0.5,
			0.5, -0.5, -0.5
		];
		const triangles = [
			// front
			0, 1, 2,
			0, 2, 3,
			// back
			4, 5, 6,
			4, 6, 7,
			// top
			8, 9, 10,
			8, 10, 11,
			// bottom
			12, 13, 14,
			12, 14, 15,
			// left
			16, 17, 18,
			16, 18, 19,
			// right
			20, 21, 22,
			20, 22, 23
		];
		const uv = [
			// front
			0, 1,
			1, 1,
			1, 0,
			0, 0,
			// back
			1, 0,
			0, 0,
			0, 1,
			1, 1,
			// top
			0, 1,
			1, 1,
			1, 0,
			0, 0,
			// bottom
			1, 0,
			0, 0,
			0, 1,
			1, 1,
			// left
			1, 0,
			0, 0,
			0, 1,
			1, 1,
			// right
			1, 0,
			0, 0,
			0, 1,
			1, 1,
		];
		const mesh = new Mesh();
		mesh.vertices = new Float32Array(vertices);
		mesh.triangles = new Uint16Array(triangles);
		mesh.setUVs(uv);
		return mesh;
	}
}