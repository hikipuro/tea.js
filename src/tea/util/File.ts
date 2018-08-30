interface FileReadImageCallback {
	(image: HTMLImageElement, path: string): void
}

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

	static readImage(url: string, callback: FileReadImageCallback): void {
		var image  = new Image();
		var onLoad = () => {
			image.removeEventListener("load", onLoad);
			image.removeEventListener("error", onError);
			callback(image, url);
		};
		var onError = () => {
			image.removeEventListener("load", onLoad);
			image.removeEventListener("error", onError);
			console.error("readImage", url);
		};
		image.addEventListener("load", onLoad);
		image.addEventListener("error", onError);
		image.src = url;
	}

	protected static createXHR(callback: (err: any, data: any) => void): XMLHttpRequest {
		var xhr = new XMLHttpRequest();
		var onReadystatechange = () => {
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
				callback(null, xhr.response);
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
