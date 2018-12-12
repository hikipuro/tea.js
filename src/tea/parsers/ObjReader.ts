import * as Tea from "../Tea";
import { OBJFile } from "./OBJFile";
import { OBJIndices } from "./obj/OBJIndices";
import { OBJFValues } from "./obj/OBJFValue";

class Context {
	url: string;
	callback: (obj: any) => void;
	obj: any;
	materialCount: number;
	materialLoaded: number;

	constructor() {
		this.materialCount = 0;
		this.materialLoaded = 0;
	}

	get filename(): string {
		var url = this.url;
		return url.substr(url.lastIndexOf("/") + 1);
	}

	get isCompleted(): boolean {
		if (this.materialLoaded >= this.materialCount) {
			return true;
		}
		return false;
	}

	complete(): void {
		this.callback(this.obj);
	}
}

export class ObjReader {
	protected app: Tea.App;

	constructor(app: Tea.App) {
		this.app = app;
	}

	static convertToMeshes(url: string, callback: (meshes: Array<Tea.Mesh>) => void): void {
		if (callback == null) {
			return;
		}
		var context = new Context();
		context.url = url;

		Tea.File.readText(url, (err: any, data: string) => {
			if (err) {
				callback(null);
				return;
			}
			OBJFile.parse(data, (document: OBJFile) => {
				callback(document.toMeshes());
			});
		});
	}

	readFile(url: string, callback: (object3d: Tea.Object3D) => void): void {
		if (callback == null) {
			return;
		}
		var context = new Context();
		context.url = url;
		context.callback = (obj) => {
			var object3d = this.createObject3D(context);
			callback(object3d);
		};

		Tea.File.readText(url, (err, data) => {
			if (err) {
				callback(null);
				return;
			}
			this.read(context, data);
		});
	}

	protected read(context: Context, data: string): void {
		var obj = {
			v: [],
			vn: [],
			vt: [],
			f: [],
			g: null,
			materials: null,
			usemtl: ""
		}
		ObjReader.forEachLine(data, (text: string, index: number) => {
			var params = text.trim().split(/\s+/);
			switch (params[0]) {
				case "#":
					// comments
					break;
				case "mtllib":
					// material
					context.materialCount++;
					var path = this.getUrl(context.url, params[1]);
					var reader = new Tea.MtlReader();
					reader.readFile(path, (material) => {
						obj.materials = material;
						context.materialLoaded++;
						if (context.isCompleted) {
							context.complete();
						}
					});
					break;
				case "usemtl":
					obj.usemtl = params[1];
					break;
				case "g":
					// group
					obj.g = params[1];
					break;
				case "v":
					// vertices
					var v = ObjReader.parseVector3(params);
					obj.v.push(v);
					break;
				case "f":
					// triangles
					var f = ObjReader.parseF(
						params,
						obj.v.length,
						obj.vt.length,
						obj.vn.length
					);
					obj.f.push(f);
					break;
				case "vn":
					// normals
					var vn = ObjReader.parseVN(params);
					obj.vn.push(vn);
					break;
				case "vt":
					// texture coord
					var vt = ObjReader.parseVT(params);
					obj.vt.push(vt);
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
			}
		}, () => {
			context.obj = obj;
			if (context.isCompleted) {
				context.complete();
			}
		});
	}

	protected createObject3D(context: Context): Tea.Object3D {
		//console.log("createObject3D");
		var obj = context.obj;
		var vf = obj.f;
		var vt = obj.vt;
		var vn = obj.vn;
		var v = obj.v;

		var vertices: Array<Tea.Vector3> = [];
		var triangles: Array<Tea.Vector3> = [];
		//var normals: Array<Tea.Vector3> = [];
		//var uv: Array<Tea.Vector2> = [];
		var normals: Array<Tea.Vector3> = [];
		if (vn.length > 0) {
			normals = new Array(vf.length);
		}
		var uv: Array<Tea.Vector2> = [];
		if (vt.length > 0) {
			uv = new Array(vf.length);
		}

		//var dup: Array<number> = new Array(triangles.length);
		//dup.fill(0);
		//var dupCount = 0;
		var t = 0;
		var length = vf.length;
		for (var i = 0; i < length; i++) {
			var f = vf[i];
			var i0 = f[0].triangle;
			var i1 = f[1].triangle;
			var i2 = f[2].triangle;
			var i3 = null;
			if (f[3] != null) {
				i3 = f[3].triangle;
			}

			/*
			if (i0 < 0) {
				//i0 = length + (i0 + 1);
				i0 = -(i0 + 1);
				//i0 = -i0;
			}
			if (i1 < 0) {
				//i1 = length + (i1 + 1);
				i1 = -(i1 + 1);
				//i1 = -i1;
			}
			if (i2 < 0) {
				//i2 = length + (i2 + 1);
				i2 = -(i2 + 1);
				//i2 = -i2;
			}
			if (i3 < 0) {
				//i3 = length + (i3 + 1);
				i3 = -(i3 + 1);
				//i3 = -i3;
			}
			*/

			/*
			if (uv[i0] != null && uv[i0].equals(vt[f[0].uv]) === false) {
				//dupCount++;
				v.push(v[i0]);
				uv.push(null);
				normals.push(null);
				i0 = v.length - 1;
			}
			if (uv[i1] != null && uv[i1].equals(vt[f[1].uv]) === false) {
				//dupCount++;
				v.push(v[i1]);
				uv.push(null);
				normals.push(null);
				i1 = v.length - 1;
			}
			if (uv[i2] != null && uv[i2].equals(vt[f[2].uv]) === false) {
				//dupCount++;
				v.push(v[i2]);
				uv.push(null);
				normals.push(null);
				i2 = v.length - 1;
			}
			if (uv[i3] != null && uv[i3].equals(vt[f[3].uv]) === false) {
				//dupCount++;
				v.push(v[i3]);
				uv.push(null);
				normals.push(null);
				i3 = v.length - 1;
			}
			//*/

			switch (f.length) {
				case 3:
					/*
					triangles.push(new Tea.Vector3(t, t + 1, t + 2));
					vertices.push(v[i0], v[i1], v[i2]);
					uv.push(vt[f[0].uv], vt[f[1].uv], vt[f[2].uv]);
					normals.push(vn[f[0].normal], vn[f[1].normal], vn[f[2].normal]);
					t += 3;
					//*/
					
					//*
					triangles.push(new Tea.Vector3(i0, i1, i2));
					/*
					if (uv[i0] == null) {
						uv[i0] = vt[f[0].uv];
					}
					if (uv[i1] == null) {
						uv[i1] = vt[f[1].uv];
					}
					if (uv[i2] == null) {
						uv[i2] = vt[f[2].uv];
					}
					//*/
					if (vt.length > 0) {
						uv[i0] = vt[f[0].uv];
						uv[i1] = vt[f[1].uv];
						uv[i2] = vt[f[2].uv];
					}
					if (vn.length > 0) {
						normals[i0] = vn[f[0].normal];
						normals[i1] = vn[f[1].normal];
						normals[i2] = vn[f[2].normal];
					}
					//*/
					break;
				case 4:
					/*
					triangles.push(new Tea.Vector3(t, t + 1, t + 2));
					triangles.push(new Tea.Vector3(t, t + 2, t + 3));
					vertices.push(v[i0], v[i1], v[i2], v[i3]);
					uv.push(vt[f[0].uv], vt[f[1].uv], vt[f[2].uv], vt[f[3].uv]);
					normals.push(vn[f[0].normal], vn[f[1].normal], vn[f[2].normal], vn[f[3].normal]);
					t += 4;
					//*/
					
					//*
					triangles.push(new Tea.Vector3(i0, i1, i2));
					triangles.push(new Tea.Vector3(i0, i2, i3));
					/*
					if (uv[i0] == null) {
						uv[i0] = vt[f[0].uv];
					}
					if (uv[i1] == null) {
						uv[i1] = vt[f[1].uv];
					}
					if (uv[i2] == null) {
						uv[i2] = vt[f[2].uv];
					}
					if (uv[i3] == null) {
						uv[i3] = vt[f[3].uv];
					}
					//*/
					if (vt.length > 0) {
						uv[i0] = vt[f[0].uv];
						uv[i1] = vt[f[1].uv];
						uv[i2] = vt[f[2].uv];
						uv[i3] = vt[f[3].uv];
					}
					if (vn.length > 0) {
						normals[i0] = vn[f[0].normal];
						normals[i1] = vn[f[1].normal];
						normals[i2] = vn[f[2].normal];
						normals[i3] = vn[f[3].normal];
					}
					//*/
					break;
				default:
					//console.log("5");
					break;
			}
		}

		//console.log("dup", dupCount);
		console.log("vertices", v.length);
		console.log("triangles", triangles.length);
		//console.log("vt", vt.length);
		var mesh = new Tea.Mesh();
		mesh.vertices = v;
		//mesh.vertices = vertices;
		mesh.triangles = triangles;
		mesh.normals = normals;
		mesh.uv = uv;
		if (vn.length <= 0) {
			mesh.calculateNormals();
		}
		mesh.uploadMeshData();

		var object3d = new Tea.Object3D(this.app);
		object3d.name = context.filename;
		var shader = new Tea.Shader(this.app);
		shader.attach(
			Tea.ShaderSources.defaultVS,
			Tea.ShaderSources.defaultFS
		);
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		//renderer.wireframe = true;
		renderer.material = Tea.Material.getDefault(this.app);
		renderer.material.shader = shader;
		if (obj.materials != null) {
			var image = obj.materials[obj.usemtl].map_Kd;
			if (image != null && image instanceof HTMLImageElement) {
				var texture = this.app.createTexture(image);
				renderer.material.mainTexture = texture;
			}
		}
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		return object3d;
	}

	protected static forEachLine(
		data: string,
		callback: (text: string, index: number) => void,
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
				callback(lines[i], i);
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

	protected getUrl(base: string, filename: string): string {
		var url = new URL(base, location.toString());
		var path = url.pathname;
		path = path.substr(0, path.lastIndexOf("/") + 1);
		return path + filename;
	}

	protected static parseVector3(params: Array<string>): Tea.Vector3 {
		var x = this.parseFloat(params[1]);
		var y = this.parseFloat(params[2]);
		var z = this.parseFloat(params[3]);
		/*
		var w = parseFloat(params[4]);
		if (isNaN(w) === false && w != 1) {
			w = 1 / w;
			x *= w;
			y *= w;
			z *= w;
		}
		//*/
		return new Tea.Vector3(x, y, z);
	}

	protected static parseF(params: Array<string>, vLength: number, vtLength: number, vnLength: number): OBJFValues {
		var list: OBJFValues = [];
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
		/*
		var w = parseFloat(params[3]);
		if (isNaN(w) === false && w != 0) {
			w = 1 / w;
			x *= w;
			y *= w;
		}
		//*/
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
}
