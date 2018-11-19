import * as fs from "fs";
import * as nodePath from "path";

export class File {
	static exists(path: string, callback: (exists: boolean) => void): void {
		if (fs == null) {
			console.warn("File.exists() is not supported.");
			callback(false);
			return;
		}
		fs.exists(path, (exists: boolean) => {
			callback(exists);
		});
	}

	static extension(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		var index = path.lastIndexOf(".");
		if (index <= 0) {
			return "";
		}
		return path.substr(index + 1);
	}

	static basename(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		var index = path.lastIndexOf("/");
		if (index < 0) {
			index = path.lastIndexOf("\\");
		}
		if (index < 0) {
			return "";
		}
		return path.substr(index + 1);
	}

	static readFile(url: string, callback: (err: any, data: ArrayBuffer) => void): void {
		if (callback == null) {
			return;
		}
		if (fs) {
			url = this.resolvePath(url);
			fs.readFile(url, (err: any, data: Buffer) => {
				var buffer = new Uint8Array(data).buffer;
				callback(err, buffer);
			});
			return;
		}
		var xhr = this.createXHR(callback);
		xhr.responseType = "arraybuffer";
		xhr.open("get", url, true);
	}

	static readText(url: string, callback: (err: any, data: string) => void): void {
		if (callback == null) {
			return;
		}
		if (fs) {
			url = this.resolvePath(url);
			fs.readFile(url, (err: any, data: Buffer) => {
				if (data == null) {
					callback(err, null);
					return;
				}
				callback(err, data.toString());
			});
			return;
		}
		var xhr = this.createXHR(callback);
		xhr.responseType = "text";
		xhr.open("get", url, true);
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
		if (fs == null) {
			load(url);
			load = undefined;
			return;
		}
		url = this.resolvePath(url);
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

	static readArrayBuffer(url: string, callback: (err: any, data: ArrayBuffer) => void): void {
		if (callback == null) {
			return;
		}
		var xhr = this.createXHR(callback);
		xhr.responseType = "arraybuffer";
		xhr.open("get", url, true);
	}

	static writeText(path: string, data: any, callback: (err: any) => void): void {
		if (fs == null) {
			console.warn("File.writeText() is not supported.");
		}
		path = this.resolvePath(path);
		fs.writeFile(path, data, "utf-8", (err) => {
			if (callback) {
				callback(err);
			}
		});
	}

	protected static resolvePath(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		if (nodePath.resolve(path) !== path) {
			path = nodePath.join("assets", path);
		}
		return path;
	}

	protected static createXHR(callback: (err: any, data: any) => void): XMLHttpRequest {
		var xhr = new XMLHttpRequest();
		var onReadystatechange = (e: Event) => {
			switch (xhr.readyState) {
			case XMLHttpRequest.OPENED:
				xhr.send(null);
				break;
			case XMLHttpRequest.HEADERS_RECEIVED:
				break;
			case XMLHttpRequest.LOADING:
				break;
			case XMLHttpRequest.DONE:
				xhr.removeEventListener("readystatechange", onReadystatechange);
				xhr.removeEventListener("error", onError);
				if (xhr.status === 0) {
					callback("error", null);
				} else {
					callback(null, xhr.response);
				}
				xhr = undefined;
				break;
			}
		};
		var onError = (e: ErrorEvent) => {
			xhr.removeEventListener("readystatechange", onReadystatechange);
			xhr.removeEventListener("error", onError);
			callback(e.error, null);
			xhr = undefined;
		};
		xhr.addEventListener("readystatechange", onReadystatechange);
		xhr.addEventListener("error", onError);
		return xhr;
	}
}
