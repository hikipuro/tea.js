import * as fs from "fs";

interface FileReadTextCallback {
	(data: string, path: string): void
}

interface FileReadImageCallback {
	(image: HTMLImageElement, path: string): void
}

export class File {
	static readText(path: string, callback: FileReadTextCallback): void {
		fs.readFile(path, "utf-8", (err, data) => {
			callback(data, path);
		});
	}

	static readImage(path: string, callback: FileReadImageCallback): void {
		const image  = new Image();
		const onLoad = () => {
			image.removeEventListener("load", onLoad);
			image.removeEventListener("error", onError);
			callback(image, path);
		}
		const onError = () => {
			image.removeEventListener("load", onLoad);
			image.removeEventListener("error", onError);
			console.error("readImage", path);
		}
		image.addEventListener("load", onLoad);
		image.addEventListener("error", onError);
		image.src = path;
	}
}
