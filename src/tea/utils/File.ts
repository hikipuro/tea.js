import * as fs from "fs";

export class File {
	static readFile(url: string, callback: (err: any, data: ArrayBuffer) => void): void {
		if (callback == null) {
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
		var xhr = this.createXHR(callback);
		xhr.responseType = "text";
		xhr.open("get", url, true);
	}

	static readImage(url: string, callback: (err: any, image: HTMLImageElement, path: string) => void): void {
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
			console.warn("File.writeText() not supported.");
		}
		fs.writeFile(path, data, "utf-8", (err) => {
			if (callback) {
				callback(err);
			}
		});
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
