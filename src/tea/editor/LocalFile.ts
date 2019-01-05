import * as fs from "fs";
import * as nodePath from "path";

export class LocalFile {
	static exists(path: string): boolean {
		return fs.existsSync(path);
	}

	static stat(path: string): fs.Stats {
		return fs.statSync(path);
	}

	static dirname(path: string): string {
		return nodePath.dirname(path);
	}

	static extname(path: string): string {
		var ext = nodePath.extname(path);
		return ext.toLowerCase();
	}

	static basename(path: string): string {
		return nodePath.basename(path);
	}

	static resolve(...paths: Array<string>): string {
		return nodePath.resolve(...paths);
	}

	static join(...paths: Array<string>): string {
		return nodePath.join(...paths);
	}

	static relative(from: string, to: string): string {
		return nodePath.relative(from, to);
	}

	static relativeFromAssets(path: string): string {
		if (path == null || path === "") {
			return path;
		}
		var currentPath = process.cwd();
		path = LocalFile.relative(currentPath, path);
		if (path.indexOf("assets") !== 0) {
			return null;
		}
		path = LocalFile.relative("assets", path);
		return path;
	}

	static isFolder(path: string): boolean {
		if (this.exists(path) === false) {
			return false;
		}
		var stat = fs.statSync(path);
		if (stat == null) {
			return false;
		}
		return stat.isDirectory();
	}

	static rename(oldPath: string, newPath: string): void {
		fs.renameSync(oldPath, newPath);
	}

	static copyFile(src: string, dest: string): void {
		fs.copyFileSync(src, dest);
	}

	static readFile(path: string): ArrayBuffer {
		path = this.resolveAssetsPath(path);
		var data = fs.readFileSync(path);
		if (data == null) {
			return null;
		}
		var buffer = new Uint8Array(data).buffer;
		return buffer as ArrayBuffer;
	}

	static readText(path: string): string {
		path = this.resolveAssetsPath(path);
		var data = fs.readFileSync(path, "utf-8");
		if (data == null) {
			return null;
		}
		return data.toString();
	}

	static readImage(url: string, callback: (err: any, image: HTMLImageElement, path: string) => void): void {
		var load = (url: string) => {
			var image = new Image();
			var onLoad = () => {
				image.removeEventListener("load", onLoad);
				image.removeEventListener("error", onError);
				callback(null, image, url);
			};
			var onError = () => {
				image.removeEventListener("load", onLoad);
				image.removeEventListener("error", onError);
				console.error("File.readImage", url);
				callback("error", image, url);
			};
			image.addEventListener("load", onLoad);
			image.addEventListener("error", onError);
			image.src = url;
		};
		url = this.resolveAssetsPath(url);
		fs.readFile(url, (err: any, data: Buffer) => {
			if (err) {
				callback("error", null, url);
				return;
			}
			var base64image = data.toString("base64");
			//var base64image = btoa(String.fromCharCode.apply(null, data));
			var mimeType = "image/" + nodePath.extname(url).substr(1);
			var dataImage = "data:" + mimeType + ";base64," + base64image;
			load(dataImage);
			load = undefined;
		});
	}

	static writeText(path: string, data: any): void {
		path = this.resolveAssetsPath(path);
		fs.writeFileSync(path, data, "utf-8");
	}

	static createFolder(path: string): void {
		if (fs.existsSync(path)) {
			return;
		}
		fs.mkdirSync(path, { recursive: true });
	}

	static removeFolder(path: string): void {
		if (fs.existsSync(path) === false) {
			return;
		}
		fs.readdirSync(path).forEach((file: string) => {
			file = nodePath.join(path, file);
			var stat = fs.lstatSync(file);
			if (stat != null && stat.isDirectory()) {
				LocalFile.removeFolder(file);
			} else {
				fs.unlinkSync(file);
			}
		});
		fs.rmdirSync(path);
	}

	static removeFile(path: string): void {
		fs.unlinkSync(path);
	}

	static resolveAssetsPath(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		if (nodePath.resolve(path) !== path) {
			path = nodePath.join("assets", path);
		}
		return path;
	}
}
