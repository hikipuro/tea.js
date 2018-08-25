import { Vector3 } from "./math/Vector3";
import { Mesh } from "./object/Mesh";

export class Primitives {
	static createQuadMesh(): Mesh {
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
		const normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		const uv = [
			0, 1,
			1, 1,
			1, 0,
			0, 0,
		];
		/*
		const colors = [
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1
		]
		*/
		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		//mesh.setColors(colors);
		mesh.calculateBounds();
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
		const normals = [
			// front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			// back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			// top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			// bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			// left
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			// right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0
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
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		mesh.calculateBounds();
		return mesh;
	}

	static createSphereMesh(hLines: number, vLines: number): Mesh {
		const vertices = [];
		const triangles = [];
		const normals = [];
		const uv = [];
		const pi = Math.PI;
		const sin = Math.sin;
		const cos = Math.cos;
		let lengthX = hLines + 1;
		let lengthY = vLines + 1;

		for (var y = 0; y <= lengthY; y++) {
			const vy = cos(pi * y / lengthY) * 0.5;
			const sy = sin(pi * y / lengthY) * 0.5;
			for (var x = 0; x < lengthX; x++) {
				const vx = cos(pi * x / lengthX) * sy;
				const vz = sin(pi * x / lengthX) * sy;
				vertices.push(vx, vy, vz);
				uv.push(-x / (lengthX * 2), y / lengthY);
				let normal = new Vector3(vx, vy, vz);
				normal = normal.normalized;
				normals.push(normal.x, normal.y, normal.z);
				console.log(vy.toFixed(3), sy.toFixed(3), (-vy + 0.5).toFixed(3));
				//console.log(vx.toFixed(3), vy.toFixed(3), vz.toFixed(3));
			}
			for (var x = 0; x <= lengthX; x++) {
				const vx = cos(pi + pi * x / lengthX) * sy;
				const vz = sin(pi + pi * x / lengthX) * sy;
				vertices.push(vx, vy, vz);
				uv.push(-(x + lengthX) / (lengthX * 2), y / lengthY);
				let normal = new Vector3(vx, vy, vz);
				normal = normal.normalized;
				normals.push(normal.x, normal.y, normal.z);
				//console.log(vx.toFixed(3), vy.toFixed(3), vz.toFixed(3));
			}
		}
		//console.log("vertices.length", vertices.length);
		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < lengthY; y++) {
			const ny = (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				const nx = x + y * lengthX;
				triangles.push(nx, nx + 1, ny + x);
				triangles.push(ny + x, nx + 1, ny + x + 1);
			}
		}
		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		//mesh.setColors(colors);
		mesh.calculateBounds();
		return mesh;
	}

	static createCylinderMesh(lines: number): Mesh {
		const vertices = [];
		const triangles = [];
		const normals = [];
		const uv = [];
		const pi = Math.PI;
		const sin = Math.sin;
		const cos = Math.cos;

		vertices.push(0, 1, 0);
		normals.push(0, 1, 0);
		uv.push(0.5, 0.5);
		for (var i = 0; i <= lines; i++) {
			const vx = cos(2 * pi * i / lines) * 0.5;
			const vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vx, 1, vz);
			normals.push(0, 1, 0);
			uv.push(-vx + 0.5, -vz + 0.5);
		}
		for (var i = 1; i <= lines; i++) {
			triangles.push(i, 0, i + 1);
		}

		let st = vertices.length / 3;
		vertices.push(0, -1, 0);
		normals.push(0, -1, 0);
		uv.push(0.5, 0.5);
		for (var i = 0; i <= lines; i++) {
			const vx = cos(2 * pi * i / lines) * 0.5;
			const vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vx, -1, vz);
			normals.push(0, -1, 0);
			uv.push(vx + 0.5, -vz + 0.5);
		}
		for (var i = 1; i <= lines; i++) {
			triangles.push(st, st + i, st + i + 1);
		}

		st = vertices.length / 3;
		for (var i = 0; i <= lines; i++) {
			const vx = cos(2 * pi * i / lines) * 0.5;
			const vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vx, -1, vz);
			vertices.push(vx, 1, vz);

			let normal = new Vector3(vx, 0, vz);
			normal = normal.normalized;
			normals.push(normal.x, normal.y, normal.z);
			normals.push(normal.x, normal.y, normal.z);
			const ux = (1 - i / lines) * 2;
			uv.push(ux, 1);
			uv.push(ux, 0);
		}
		for (var i = 0; i < lines * 2; i += 2) {
			const n = st + i;
			triangles.push(n, n + 1, n + 2);
			triangles.push(n + 1, n + 3, n + 2);
			//triangles.push(st + i, st + i + 1, st + i + 2);
		}

		//console.log("vertices.length 2", vertices.length);
		//console.log("normals.length 2", normals.length);

		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		//mesh.setColors(colors);
		mesh.calculateBounds();
		return mesh;
	}

	static createPlaneMesh(size: number): Mesh {
		const vertices = [];
		const triangles = [];
		const normals = [];
		const uv = [];

		const halfSize = size / 2;
		for (var z = 0; z <= size; z++) {
			const vz = z - halfSize;
			for (var x = 0; x <= size; x++) {
				const vx = x - halfSize;
				vertices.push(vx, 0, vz);
				normals.push(0, 1, 0);
				uv.push(-x / size, -z / size);
			}
		}

		for (var z = 0; z < size; z++) {
			for (var x = 0; x < size; x++) {
				const i = x + (size + 1) * z;
				triangles.push(i + 1, i, i + size + 1);
				triangles.push(i + 1, i + size + 1, i + size + 2);
			}
		}

		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		//mesh.setColors(colors);
		mesh.calculateBounds();
		return mesh;
	}

	static createCapsuleMesh(hLines: number, vLines: number): Mesh {
		const vertices = [];
		const triangles = [];
		const normals = [];
		const uv = [];
		const pi = Math.PI;
		const sin = Math.sin;
		const cos = Math.cos;
		let lengthX = hLines;
		let lengthY = vLines * 2;

		for (var y = 0; y <= vLines; y++) {
			const vy = cos(pi * y / lengthY) * 0.5 + 0.5;
			const sy = sin(pi * y / lengthY) * 0.5;
			for (var x = 0; x <= lengthX * 2; x++) {
				const vx = -cos(pi * x / lengthX) * sy;
				const vz = sin(pi * x / lengthX) * sy;
				vertices.push(vx, vy, vz);
				let normal = new Vector3(vx, vy - 0.5, vz);
				normal = normal.normalized;
				normals.push(normal.x, normal.y, normal.z);
				//uv.push(1 - (x / (lengthX * 2)), y / lengthY * 0.5);
				uv.push(x / (lengthX * 2), y / lengthY * 0.5);
			}
		}

		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < vLines; y++) {
			const ny = (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				const nx = x + y * lengthX;
				//triangles.push(nx, nx + 1, ny + x);
				//triangles.push(ny + x, nx + 1, ny + x + 1);
				triangles.push(nx + 1, nx, ny + x);
				triangles.push(nx + 1, ny + x, ny + x + 1);
			}
		}

		lengthX = hLines;
		let st = vertices.length / 3;
		for (var y = 0; y <= vLines; y++) {
			const vy = -cos(pi * y / lengthY) * 0.5 - 0.5;
			const sy = sin(pi * y / lengthY) * 0.5;
			for (var x = 0; x <= lengthX * 2; x++) {
				const vx = -cos(pi * x / lengthX) * sy;
				const vz = sin(pi * x / lengthX) * sy;
				vertices.push(vx, vy, vz);
				let normal = new Vector3(vx, vy + 0.5, vz);
				normal = normal.normalized;
				normals.push(normal.x, normal.y, normal.z);
				//uv.push(1 - (x / (lengthX * 2)), 1 - (y / lengthY * 0.5));
				uv.push(x / (lengthX * 2), 1 - (y / lengthY * 0.5));
				console.log("uv", 1 - (x / (lengthX * 2)), 1 - (y / lengthY * 0.5));
			}
		}

		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < vLines; y++) {
			const ny = st + (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				const nx = st + x + y * lengthX;
				//triangles.push(nx + 1, nx, ny + x);
				//triangles.push(nx + 1, ny + x, ny + x + 1);
				triangles.push(nx, nx + 1, ny + x);
				triangles.push(nx + 1, ny + x + 1, ny + x);
			}
		}

		st = vertices.length / 3;
		lengthX = hLines * 2;
		for (var i = 0; i <= lengthX; i++) {
			const vx = -cos(2 * pi * i / lengthX) * 0.5;
			const vz = sin(2 * pi * i / lengthX) * 0.5;
			vertices.push(vx, 0.5, vz);
			vertices.push(vx, -0.5, vz);

			let normal = new Vector3(vx, 0, vz);
			normal = normal.normalized;
			normals.push(normal.x, normal.y, normal.z);
			normals.push(normal.x, normal.y, normal.z);
			uv.push(i / lengthX, 0.25);
			uv.push(i / lengthX, 0.75);
			console.log("uv 2", i / lengthX, 0.25);
		}
		for (var i = 0; i < lengthX * 2; i += 2) {
			const n = st + i;
			triangles.push(n, n + 1, n + 2);
			triangles.push(n + 1, n + 3, n + 2);
			//triangles.push(n + 1, n, n + 2);
			//triangles.push(n + 1, n + 2, n + 3);
		}

		console.log("capsule vertex", vertices.length / 3);

		const mesh = new Mesh();
		mesh.setVertices(vertices);
		mesh.setTriangles(triangles);
		mesh.setNormals(normals);
		mesh.setUVs(uv);
		//mesh.setColors(colors);
		mesh.calculateBounds();
		return mesh;
	}
}