import * as Tea from "../Tea";

class MaterialReaderContext {
	url: string;
	callback: (materials: any) => void;
	materials: any;
	textureCount: number;
	textureLoaded: number;

	constructor() {
		this.textureCount = 0;
		this.textureLoaded = 0;
	}

	get isCompleted(): boolean {
		if (this.textureLoaded >= this.textureCount) {
			return true;
		}
		return false;
	}

	complete(): void {
		this.callback(this.materials);
	}
}

class MaterialReader {
	constructor() {
	}

	readFile(url: string, callback: (material: any) => void): void {
		if (callback == null) {
			return;
		}
		var context = new MaterialReaderContext();
		context.url = url;
		context.callback = callback;

		Tea.File.readText(url, (err, data) => {
			if (err) {
				callback(null);
				return;
			}
			this.read(context, data);
		});
	}

	protected read(context: MaterialReaderContext, data: string): void {
		var materials: any = {};
		var material: any = null;
		this.forEachLine(data, (text: string, index: number) => {
			var params = text.trim().split(/\s+/);
			switch (params[0]) {
				case "#":
					// comments
					break;
				case "newmtl":
					// new material
					material = this.createMaterial();
					materials[params[1]] = material;
					break;
				case "Ka": // ambient
				case "Kd": // diffuse
				case "Ks": // specular
				case "Ke": // ?
				case "Tf": // ?
					material[params[0]] = this.parseColor(params);
					break;
				case "Ns": // ?
				case "Ni": // ?
				case "Tr": // ?
				case "d":  // dissolve
					material[params[0]] = this.parseFloat(params);
					break;
				case "illum":
					// illumination
					material.illum = this.parseFloat(params);
					break;
				case "map_Ka":   // texture
				case "map_Kd":   // 
				case "map_Ks":   // 
				case "map_Ns":   // 
				case "map_d":    // 
				case "map_bump": // 
				case "bump":     // 
				case "disp":     // 
				case "decal":    // 
					var path = "";
					if (params.length <= 2) {
						path = this.getUrl(context.url, params[1]);
					} else {
						path = this.getUrl(context.url, params[params.length - 1]);
					}
					//console.log("path", path);
					if (material[params[0]] == null) {
						context.textureCount++;
						material[params[0]] = path;
					}
					//this.readImage(material, params[0], path);
					break;
			}
		});

		context.materials = materials;
		if (context.isCompleted) {
			//console.log("complete");
			context.complete();
			return;
		}

		for (var key in materials) {
			var m = materials[key];
			for (var k in m) {
				if (k.indexOf("map_") < 0) {
					continue;
				}
				var path = m[k];
				if (path != null && path !== "") {
					this.readImage(context, m, k, path);
				}
			}
		}
	}

	protected readImage(context: MaterialReaderContext, material: any, name: string, path: string): void {
		Tea.File.readImage(path, (err, image) => {
			if (err == null) {
				material[name] = image;
			}
			context.textureLoaded++;
			//console.log("context.textureLoaded", context.textureLoaded, context.textureCount);
			if (context.isCompleted) {
				//console.log("complete");
				context.complete();
			}
		});
	}


	protected createMaterial(): any {
		return {
			Ka: null,
			Kd: null,
			Ks: null,
			Ke: null,
			Ns: null,
			Ni: null,
			Tr: null,
			Ts: null,
			d: null,
			illum: null,
			map_Ka: null,
			map_Kd: null,
			map_Ks: null,
			map_Ns: null,
			map_d: null,
			map_bump: null,
			bump: null,
			disp: null,
			decal: null
		};
	}

	protected forEachLine(data: string, callback: (text: string, index: number) => void): void {
		var lines = data.split(/\r\n|\r|\n/);
		var length = lines.length;
		for (var i = 0; i < length; i++) {
			callback(lines[i], i);
		}
	}

	protected getUrl(base: string, filename: string): string {
		var url = new URL(base, location.toString());
		var path = url.pathname;
		path = path.substr(0, path.lastIndexOf("/") + 1);
		return path + filename;
	}

	protected parseFloat(params: Array<string>): number | null {
		var value = parseFloat(params[1]);
		if (isNaN(value)) {
			return null;
		}
		return value;
	}

	protected parseColor(params: Array<string>): Tea.Color {
		var r = parseFloat(params[1]);
		var g = parseFloat(params[2]);
		var b = parseFloat(params[3]);
		return new Tea.Color(r, g, b, 1);
	}
}

class ObjReaderContext {
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

	readFile(url: string, callback: (object3d: Tea.Object3D) => void): void {
		if (callback == null) {
			return;
		}
		var context = new ObjReaderContext();
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

	protected read(context: ObjReaderContext, data: string): void {
		var obj = {
			v: [],
			vn: [],
			vt: [],
			f: [],
			g: null,
			materials: null,
			usemtl: ""
		}
		this.forEachLine(data, (text: string, index: number) => {
			var params = text.trim().split(/\s+/);
			switch (params[0]) {
				case "#":
					// comments
					break;
				case "mtllib":
					// material
					context.materialCount++;
					var path = this.getUrl(context.url, params[1]);
					var reader = new MaterialReader();
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
					var v = this.parseVector3(params);
					obj.v.push(v);
					break;
				case "f":
					// triangles
					var f = this.parseF(
						params,
						obj.v.length,
						obj.vt.length,
						obj.vn.length
					);
					obj.f.push(f);
					break;
				case "vn":
					// normals
					var vn = this.parseVN(params);
					obj.vn.push(vn);
					break;
				case "vt":
					// texture coord
					var vt = this.parseVT(params);
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
		});

		context.obj = obj;
		if (context.isCompleted) {
			context.complete();
		}
	}

	protected createObject3D(context: ObjReaderContext): Tea.Object3D {
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

	protected forEachLine(data: string, callback: (text: string, index: number) => void): void {
		var lines = data.split(/\r\n|\r|\n/);
		var length = lines.length;
		for (var i = 0; i < length; i++) {
			callback(lines[i], i);
		}
	}

	protected getUrl(base: string, filename: string): string {
		var url = new URL(base, location.toString());
		var path = url.pathname;
		path = path.substr(0, path.lastIndexOf("/") + 1);
		return path + filename;
	}

	protected parseVector3(params: Array<string>): Tea.Vector3 {
		var x = parseFloat(params[1]);
		var y = parseFloat(params[2]);
		var z = parseFloat(params[3]);
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

	protected parseF(params: Array<string>, vLength: number, vtLength: number, vnLength: number): any {
		var list = [];
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
				triangle: triangle - 1,
				uv: uv - 1,
				normal: normal - 1
			});
		}
		return list;
	}

	protected parseVN(params: Array<string>): Tea.Vector3 {
		var x = parseFloat(params[1]);
		var y = parseFloat(params[2]);
		var z = parseFloat(params[3]);
		var normal = new Tea.Vector3(x, y, z);
		return normal.normalized;
	}

	protected parseVT(params: Array<string>): Tea.Vector2 {
		var x = parseFloat(params[1]);
		var y = parseFloat(params[2]);
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

	protected parseInt(s: string): number {
		var value = parseInt(s);
		if (isNaN(value)) {
			return 0;
		}
		return value;
	}
}
