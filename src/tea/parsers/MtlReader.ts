import * as Tea from "../Tea";

class Context {
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

export class MtlReader {
	constructor() {
	}

	readFile(url: string, callback: (material: any) => void): void {
		if (callback == null) {
			return;
		}
		var context = new Context();
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

	protected read(context: Context, data: string): void {
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

	protected readImage(context: Context, material: any, name: string, path: string): void {
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
