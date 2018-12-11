import * as Tea from "../../Tea";
import { ObjIndices } from "./ObjIndices";
import { ObjFValues } from "./ObjFValue";

export class ObjDocument {
	v: Array<Tea.Vector3>;
	vn: Array<Tea.Vector3>;
	vt: Array<Tea.Vector2>;
	f: Array<ObjIndices>;
	//g: any;
	materials: any;
	usemtl: string;

	constructor() {
		this.v = [];
		this.vn = [];
		this.vt = [];
		this.f = [];
		//this.g = null;
		this.materials = null;
		this.usemtl = "";
	}

	static parse(data: string, callback: (document: ObjDocument) => void, iterations: number = 3000): void {
		var document = new ObjDocument();
		var indices: ObjIndices = null;
		this.forEachLine(data, (text: string, index: number, progress: number) => {
			//if (index % 1000 === 0) {
			//	console.log("progress", progress);
			//}
			var params = text.trim().split(/\s+/);
			switch (params[0]) {
				case "":
					// blank
					break;
				case "#":
					// comments
					break;
				case "mtllib":
					// material
					break;
				case "usemtl":
					if (indices) {
						indices.material = params[1];
					}
					break;
				case "g":
					// group
					indices = document.addIndices();
					indices.group = params[1];
					break;
				case "v":
					// vertices
					var v = this.parseVector3(params);
					document.v.push(v);
					break;
				case "f":
					// triangles
					if (indices) {
						var f = this.parseF(
							params,
							document.v.length,
							document.vt.length,
							document.vn.length
						);
						indices.push(f);
					}
					break;
				case "vn":
					// normals
					var vn = this.parseVN(params);
					document.vn.push(vn);
					break;
				case "vt":
					// texture coord
					var vt = this.parseVT(params);
					document.vt.push(vt);
					break;
				case "vp":
					// parameter space vertices
					break;
				case "s":
					// smooth shading
					break;
				case "l":
					// line element
					break;
				default:
					console.warn("ObjDocument: unknown data", params);
					break;
			}
		}, () => {
			callback(document);
		}, iterations);
	}

	protected static forEachLine(
		data: string,
		callback: (text: string, index: number, progress: number) => void,
		complete: () => void,
		iterations: number = 3000): void
	{
		if (data == null || data.length <= 0) {
			return;
		}
		var lines = data.split(/\r\n|\r|\n/);
		var call = (lines: Array<string>, start: number, count: number) => {
			var length = start + count;
			var lineCount = lines.length;
			if (length > lineCount) {
				length = lineCount;
			}
			var i = start;
			for (; i < length; i++) {
				callback(lines[i], i, i / lineCount);
			}
			if (i >= lineCount) {
				complete();
			} else {
				setTimeout(() => {
					call(lines, start + count, count);
				}, 0);
			}
		}
		setTimeout(() => {
			call(lines, 0, iterations);
		}, 0);
	}

	protected static parseVector3(params: Array<string>): Tea.Vector3 {
		var x = this.parseFloat(params[1]);
		var y = this.parseFloat(params[2]);
		var z = this.parseFloat(params[3]);
		return new Tea.Vector3(x, y, z);
	}

	protected static parseF(params: Array<string>, vLength: number, vtLength: number, vnLength: number): ObjFValues {
		var list: ObjFValues = [];
		var length = params.length;
		for (var i = 1; i < length; i++) {
			if (params[i] == "") {
				continue;
			}
			var param = params[i].split("/");
			var triangle = this.parseInt(param[0]);
			var uv = this.parseInt(param[1]);
			var normal = this.parseInt(param[2]);
			if (triangle < 0) {
				triangle += vLength + 1;
			}
			if (uv < 0) {
				uv += vtLength + 1;
			}
			if (normal < 0) {
				normal += vnLength + 1;
			}
			list.push({
				index: triangle - 1,
				uv: uv - 1,
				normal: normal - 1
			});
		}
		return list;
	}

	protected static parseVN(params: Array<string>): Tea.Vector3 {
		var x = this.parseFloat(params[1]);
		var y = this.parseFloat(params[2]);
		var z = this.parseFloat(params[3]);
		var normal = new Tea.Vector3(x, y, z);
		return normal.normalized;
	}

	protected static parseVT(params: Array<string>): Tea.Vector2 {
		var x = this.parseFloat(params[1]);
		var y = this.parseFloat(params[2]);
		return new Tea.Vector2(x, 1 - y);
	}

	protected static parseFloat(s: string): number {
		var value = parseFloat(s);
		if (isNaN(value)) {
			return 0.0;
		}
		return value;
	}

	protected static parseInt(s: string): number {
		var value = parseInt(s);
		if (isNaN(value)) {
			return 0;
		}
		return value;
	}

	addIndices(): ObjIndices {
		var indices = new ObjIndices();
		this.f.push(indices);
		return indices;
	}

	toMeshes(): Array<Tea.Mesh> {
		var meshes: Array<Tea.Mesh> = [];
		var length = this.f.length;
		for (var i = 0; i < length; i++) {
			var mesh = this.createMesh(this.f[i]);
			meshes.push(mesh);
			//console.log("mesh", mesh.vertices.length, mesh.triangles.length);
		}
		return meshes;
	}

	protected createMesh(f: ObjIndices): Tea.Mesh {
		var vt = this.vt;
		var vn = this.vn;
		var v = this.v;

		var vertices: Array<Tea.Vector3> = null;
		var triangles: Array<Tea.Vector3> = [];
		var normals: Array<Tea.Vector3> = [];
		var uv: Array<Tea.Vector2> = [];

		var hash = this.createIndexList(f);
		var keys = Object.keys(hash);
		vertices = new Array(keys.length);
		if (vn.length > 0) {
			normals = new Array(keys.length);
		}
		if (vt.length > 0) {
			uv = new Array(keys.length);
		}
		keys.forEach((key: string) => {
			var i = hash[key];
			vertices[i] = v[parseInt(key)];
		});

		var length = f.length;
		for (var i = 0; i < length; i++) {
			var fValues = f.fValues[i];
			var i0 = hash[fValues[0].index];
			var i1 = hash[fValues[1].index];
			var i2 = hash[fValues[2].index];
			var i3 = null;
			if (fValues[3] != null) {
				i3 = hash[fValues[3].index];
			}
			//console.log(i0, i1, i2, i3);
			switch (fValues.length) {
				case 3:
					triangles.push(new Tea.Vector3(i0, i1, i2));
					if (vt.length > 0) {
						uv[i0] = vt[fValues[0].uv];
						uv[i1] = vt[fValues[1].uv];
						uv[i2] = vt[fValues[2].uv];
					}
					if (vn.length > 0) {
						normals[i0] = vn[fValues[0].normal];
						normals[i1] = vn[fValues[1].normal];
						normals[i2] = vn[fValues[2].normal];
					}
					break;
				case 4:
					triangles.push(new Tea.Vector3(i0, i1, i2));
					triangles.push(new Tea.Vector3(i0, i2, i3));
					if (vt.length > 0) {
						uv[i0] = vt[fValues[0].uv];
						uv[i1] = vt[fValues[1].uv];
						uv[i2] = vt[fValues[2].uv];
						uv[i3] = vt[fValues[3].uv];
					}
					if (vn.length > 0) {
						normals[i0] = vn[fValues[0].normal];
						normals[i1] = vn[fValues[1].normal];
						normals[i2] = vn[fValues[2].normal];
						normals[i3] = vn[fValues[3].normal];
					}
					break;
				default:
					console.log("parse error");
					break;
			}
		}
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		if (vn.length <= 0) {
			mesh.calculateNormals();
		}
		mesh.name = f.group;
		mesh.calculateBounds();
		mesh.uploadMeshData();
		return mesh;
	}

	protected createIndexList(f: ObjIndices): Object {
		var hash = {};
		var fLength = f.fValues.length;
		var count = 0;
		for (var i = 0; i < fLength; i++) {
			var value = f.fValues[i];
			var length = value.length;
			for (var n = 0; n < length; n++) {
				var index = value[n].index;
				/*
				if (hash[index] == null) {
					hash[index] = [];
				}
				hash[index].push(value[n]);
				*/
				if (hash[index] != null) {
					continue;
				}
				hash[index] = count;
				count++;
			}
		}
		//console.log(hash);
		return hash;
	}
}
