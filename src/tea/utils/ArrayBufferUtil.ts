export class ArrayBufferUtil {
	static fromString(value: string, callback: (buffer: ArrayBuffer) => void): void {
		var reader = new FileReader();
		var onLoadEnd = () => {
			reader.removeEventListener("loadend", onLoadEnd);
			callback(reader.result);
			reader = undefined;
		};
		reader.addEventListener("loadend", onLoadEnd);
		reader.readAsArrayBuffer(new Blob([value]));
	}

	static toString(buffer: ArrayBuffer, callback: (str: string) => void): void {
		var reader = new FileReader();
		var onLoadEnd = () => {
			reader.removeEventListener("loadend", onLoadEnd);
			callback(reader.result);
			reader = undefined;
		};
		reader.addEventListener("loadend", onLoadEnd);
		reader.readAsText(new Blob([buffer]));
	}

	static toImage(buffer: ArrayBuffer, mimeType: string, callback: (image: HTMLImageElement) => void): void {
		if (callback == null) {
			return;
		}
		var blob = null;
		if (mimeType == null) {
			blob = new Blob([buffer]);
		} else {
			blob = new Blob([buffer], { type: mimeType });
		}
		var url = URL.createObjectURL(blob);
		var image = new Image();
		image.onload = function() {
			URL.revokeObjectURL(url);
			blob = undefined;
			callback(image);
		};
		image.src = url;
	}
}
