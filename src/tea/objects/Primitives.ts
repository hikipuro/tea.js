import * as Tea from "../Tea";

function vec2(x: number, y: number): Tea.Vector2 {
	return new Tea.Vector2(x, y);
}

function vec3(x: number, y: number, z: number): Tea.Vector3 {
	return new Tea.Vector3(x, y, z);
}

export class Primitives {
	protected static _cubeCache: Tea.Mesh;

	static createQuadMesh(): Tea.Mesh {
		var vertices = [
			vec3(-0.5, -0.5, 0),
			vec3( 0.5, -0.5, 0),
			vec3( 0.5,  0.5, 0),
			vec3(-0.5,  0.5, 0)
		];
		var triangles = [
			vec3(0, 1, 2),
			vec3(0, 2, 3)
		];
		var normals = [
			vec3(0, 0, 1),
			vec3(0, 0, 1),
			vec3(0, 0, 1),
			vec3(0, 0, 1)
		];
		var uv = [
			vec2(0, 0),
			vec2(1, 0),
			vec2(1, 1),
			vec2(0, 1)
		];
		/*
		var colors = [
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1
		]
		*/
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		//mesh.setColors(colors);
		mesh.calculateBounds();
		return mesh;
	}

	static createCubeMesh(): Tea.Mesh {
		if (this._cubeCache != null) {
			return this._cubeCache.clone();
		}
		var vertices = [
			// front
			vec3( 0.5,  0.5, 0.5),
			vec3(-0.5,  0.5, 0.5),
			vec3(-0.5, -0.5, 0.5),
			vec3( 0.5, -0.5, 0.5),
			// back
			vec3(-0.5,  0.5, -0.5),
			vec3( 0.5,  0.5, -0.5),
			vec3( 0.5, -0.5, -0.5),
			vec3(-0.5, -0.5, -0.5),
			// top
			vec3( 0.5,  0.5, -0.5),
			vec3(-0.5,  0.5, -0.5),
			vec3(-0.5,  0.5,  0.5),
			vec3( 0.5,  0.5,  0.5),
			// bottom
			vec3(-0.5, -0.5, -0.5),
			vec3( 0.5, -0.5, -0.5),
			vec3( 0.5, -0.5,  0.5),
			vec3(-0.5, -0.5,  0.5),
			// left
			vec3(-0.5,  0.5,  0.5),
			vec3(-0.5,  0.5, -0.5),
			vec3(-0.5, -0.5, -0.5),
			vec3(-0.5, -0.5,  0.5),
			// right
			vec3( 0.5,  0.5, -0.5),
			vec3( 0.5,  0.5,  0.5),
			vec3( 0.5, -0.5,  0.5),
			vec3( 0.5, -0.5, -0.5)
		];
		var triangles = [
			// front
			vec3( 0,  1,  2),
			vec3( 0,  2,  3),
			// back
			vec3( 4,  5,  6),
			vec3( 4,  6,  7),
			// top
			vec3( 8,  9, 10),
			vec3( 8, 10, 11),
			// bottom
			vec3(12, 13, 14),
			vec3(12, 14, 15),
			// left
			vec3(16, 17, 18),
			vec3(16, 18, 19),
			// right
			vec3(20, 21, 22),
			vec3(20, 22, 23)
		];
		var normals = [
			// front
			vec3( 0,  0,  1),
			vec3( 0,  0,  1),
			vec3( 0,  0,  1),
			vec3( 0,  0,  1),
			// back
			vec3( 0,  0, -1),
			vec3( 0,  0, -1),
			vec3( 0,  0, -1),
			vec3( 0,  0, -1),
			// top
			vec3( 0,  1,  0),
			vec3( 0,  1,  0),
			vec3( 0,  1,  0),
			vec3( 0,  1,  0),
			// bottom
			vec3( 0, -1,  0),
			vec3( 0, -1,  0),
			vec3( 0, -1,  0),
			vec3( 0, -1,  0),
			// left
			vec3(-1,  0,  0),
			vec3(-1,  0,  0),
			vec3(-1,  0,  0),
			vec3(-1,  0,  0),
			// right
			vec3( 1,  0,  0),
			vec3( 1,  0,  0),
			vec3( 1,  0,  0),
			vec3( 1,  0,  0)
		];
		var uv = [
			// front
			vec2(0, 0),
			vec2(1, 0),
			vec2(1, 1),
			vec2(0, 1),
			// back
			vec2(1, 1),
			vec2(0, 1),
			vec2(0, 0),
			vec2(1, 0),
			// top
			vec2(0, 0),
			vec2(1, 0),
			vec2(1, 1),
			vec2(0, 1),
			// bottom
			vec2(1, 1),
			vec2(0, 1),
			vec2(0, 0),
			vec2(1, 0),
			// left
			vec2(1, 1),
			vec2(0, 1),
			vec2(0, 0),
			vec2(1, 0),
			// right
			vec2(1, 1),
			vec2(0, 1),
			vec2(0, 0),
			vec2(1, 0),
		];
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		mesh.calculateBounds();
		this._cubeCache = mesh.clone();
		return mesh;
	}

	static createSphereMesh(hLines: number, vLines: number): Tea.Mesh {
		var vertices: Array<Tea.Vector3> = [];
		var triangles: Array<Tea.Vector3> = [];
		var normals: Array<Tea.Vector3> = [];
		var uv: Array<Tea.Vector2> = [];
		var pi = Math.PI;
		var sin = Math.sin;
		var cos = Math.cos;
		var lengthX = hLines + 1;
		var lengthY = vLines + 1;

		for (var y = 0; y <= lengthY; y++) {
			var vy = cos(pi * y / lengthY) * 0.5;
			var sy = sin(pi * y / lengthY) * 0.5;
			for (var x = 0; x < lengthX; x++) {
				var vx = cos(pi * x / lengthX) * sy;
				var vz = sin(pi * x / lengthX) * sy;
				vertices.push(vec3(vx, vy, vz));
				uv.push(vec2(1 - x / (lengthX * 2), 1 - y / lengthY));
				var normal = vec3(vx, vy, vz);
				normals.push(normal.normalized);
				//console.log(vy.toFixed(3), sy.toFixed(3), (-vy + 0.5).toFixed(3));
				//console.log(vx.toFixed(3), vy.toFixed(3), vz.toFixed(3));
			}
			for (var x = 0; x <= lengthX; x++) {
				var vx = cos(pi + pi * x / lengthX) * sy;
				var vz = sin(pi + pi * x / lengthX) * sy;
				vertices.push(vec3(vx, vy, vz));
				uv.push(vec2(1 - (x + lengthX) / (lengthX * 2), 1 - y / lengthY));
				var normal = vec3(vx, vy, vz);
				normals.push(normal.normalized);
				//console.log(vx.toFixed(3), vy.toFixed(3), vz.toFixed(3));
			}
		}
		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < lengthY; y++) {
			var ny = (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				var nx0 = x + y * lengthX;
				var nx1 = nx0 + 1, nyx = ny + x;
				triangles.push(vec3(nx0, nx1, nyx));
				triangles.push(vec3(nyx, nx1, nyx + 1));
			}
		}
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		mesh.calculateBounds();
		return mesh;
	}

	static createCylinderMesh(lines: number): Tea.Mesh {
		var vertices: Array<Tea.Vector3> = [];
		var triangles: Array<Tea.Vector3> = [];
		var normals: Array<Tea.Vector3> = [];
		var uv: Array<Tea.Vector2> = [];
		var pi = Math.PI;
		var sin = Math.sin;
		var cos = Math.cos;

		vertices.push(vec3(0, 1, 0));
		normals.push(vec3(0, 1, 0));
		uv.push(vec2(0.5, 0.5));
		for (var i = 0; i <= lines; i++) {
			var vx = cos(2 * pi * i / lines) * 0.5;
			var vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vec3(vx, 1, vz));
			normals.push(vec3(0, 1, 0));
			uv.push(vec2(1 - vx - 0.5, vz + 0.5));
		}
		for (var i = 1; i <= lines; i++) {
			triangles.push(vec3(i, 0, i + 1));
		}

		var st = vertices.length;
		vertices.push(vec3(0, -1, 0));
		normals.push(vec3(0, -1, 0));
		uv.push(vec2(0.5, 0.5));
		for (var i = 0; i <= lines; i++) {
			var vx = cos(2 * pi * i / lines) * 0.5;
			var vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vec3(vx, -1, vz));
			normals.push(vec3(0, -1, 0));
			uv.push(vec2(vx + 0.5, vz + 0.5));
		}
		for (var i = 1; i <= lines; i++) {
			triangles.push(vec3(st, st + i, st + i + 1));
		}

		st = vertices.length;
		for (var i = 0; i <= lines; i++) {
			var vx = cos(2 * pi * i / lines) * 0.5;
			var vz = sin(2 * pi * i / lines) * 0.5;
			vertices.push(vec3(vx, -1, vz));
			vertices.push(vec3(vx,  1, vz));

			var normal = vec3(vx, 0, vz);
			normal = normal.normalized;
			normals.push(normal);
			normals.push(normal);
			var ux = (1 - i / lines) * 2;
			uv.push(vec2(ux, 0));
			uv.push(vec2(ux, 1));
		}
		for (var i = 0; i < lines * 2; i += 2) {
			var n = st + i;
			triangles.push(vec3(n, n + 1, n + 2));
			triangles.push(vec3(n + 1, n + 3, n + 2));
			//triangles.push(st + i, st + i + 1, st + i + 2);
		}

		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		mesh.calculateBounds();
		return mesh;
	}

	static createPlaneMesh(size: number): Tea.Mesh {
		var vertices: Array<Tea.Vector3> = [];
		var triangles: Array<Tea.Vector3> = [];
		var normals: Array<Tea.Vector3> = [];
		var uv: Array<Tea.Vector2> = [];

		var halfSize = size / 2;
		for (var z = 0; z <= size; z++) {
			var vz = z - halfSize;
			for (var x = 0; x <= size; x++) {
				var vx = x - halfSize;
				vertices.push(vec3(vx, 0, vz));
				normals.push(vec3(0, 1, 0));
				uv.push(vec2(1 - x / size, z / size));
			}
		}

		for (var z = 0; z < size; z++) {
			for (var x = 0; x < size; x++) {
				var i = x + (size + 1) * z;
				triangles.push(vec3(i + 1, i, i + size + 1));
				triangles.push(vec3(i + 1, i + size + 1, i + size + 2));
			}
		}

		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		mesh.calculateBounds();
		return mesh;
	}

	static createCapsuleMesh(hLines: number, vLines: number): Tea.Mesh {
		var vertices: Array<Tea.Vector3> = [];
		var triangles: Array<Tea.Vector3> = [];
		var normals: Array<Tea.Vector3> = [];
		var uv: Array<Tea.Vector2> = [];
		var pi = Math.PI;
		var sin = Math.sin;
		var cos = Math.cos;
		var lengthX = hLines;
		var lengthY = vLines * 2;

		for (var y = 0; y <= vLines; y++) {
			var ay = pi * y / lengthY;
			var vy = cos(ay) * 0.5 + 0.5;
			var sy = sin(ay) * 0.5;
			for (var x = 0; x <= lengthX * 2; x++) {
				var a = pi * x / lengthX;
				var vx = -cos(a) * sy;
				var vz =  sin(a) * sy;
				vertices.push(vec3(vx, vy, vz));
				var normal = vec3(vx, vy - 0.5, vz);
				normals.push(normal.normalized);
				uv.push(vec2(x / (lengthX * 2), 1 - y / lengthY * 0.5));
			}
		}

		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < vLines; y++) {
			var ny = (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				var nx0 = x + y * lengthX;
				var nx1 = nx0 + 1, nyx = ny + x;
				triangles.push(vec3(nx1, nx0, nyx));
				triangles.push(vec3(nx1, nyx, nyx + 1));
			}
		}

		lengthX = hLines;
		var st = vertices.length;
		for (var y = 0; y <= vLines; y++) {
			var ay = pi * y / lengthY;
			var vy = -cos(ay) * 0.5 - 0.5;
			var sy =  sin(ay) * 0.5;
			for (var x = 0; x <= lengthX * 2; x++) {
				var a = pi * x / lengthX;
				var vx = -cos(a) * sy;
				var vz =  sin(a) * sy;
				vertices.push(vec3(vx, vy, vz));
				var normal = vec3(vx, vy + 0.5, vz);
				normals.push(normal.normalized);
				uv.push(vec2(x / (lengthX * 2), y / lengthY * 0.5));
			}
		}

		lengthX = lengthX * 2 + 1;
		for (var y = 0; y < vLines; y++) {
			var ny = st + (y + 1) * lengthX;
			for (var x = 0; x < lengthX - 1; x++) {
				var nx0 = st + x + y * lengthX;
				var nx1 = nx0 + 1, nyx = ny + x;
				triangles.push(vec3(nx0, nx1, nyx));
				triangles.push(vec3(nx1, nyx + 1, nyx));
			}
		}

		st = vertices.length;
		lengthX = hLines * 2;
		for (var i = 0; i <= lengthX; i++) {
			var a = 2 * pi * i / lengthX;
			var vx = -cos(a) * 0.5;
			var vz =  sin(a) * 0.5;
			vertices.push(vec3(vx,  0.5, vz));
			vertices.push(vec3(vx, -0.5, vz));

			var normal = vec3(vx, 0, vz);
			normal = normal.normalized;
			normals.push(normal);
			normals.push(normal);
			var uvx = i / lengthX;
			uv.push(vec2(uvx, 0.75));
			uv.push(vec2(uvx, 0.25));
		}
		for (var i = 0; i < lengthX * 2; i += 2) {
			var n0 = st + i;
			var n1 = n0 + 1, n2 = n0 + 2, n3 = n0 + 3;
			triangles.push(vec3(n0, n1, n2));
			triangles.push(vec3(n1, n3, n2));
		}

		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		mesh.calculateBounds();
		return mesh;
	}
}
