import * as Tea from "../Tea";
import { DAEAsset } from "./dae/DAEAsset";
import { DAELibraryGeometries } from "./dae/DAELibraryGeometries";

export class DAEFile {
	asset: DAEAsset;
	libraryGeometries: DAELibraryGeometries;

	constructor() {
		this.asset = null;
		this.libraryGeometries = null;
	}

	static load(url: string, callback: (daeFile: DAEFile) => void): void {
		if (url == null || url === "") {
			callback(null);
			return;
		}
		Tea.File.readText(url, (err: any, data: string) => {
			if (err) {
				callback(null);
				return;
			}
			this.parse(data, callback, (progress: number) => {
				console.log("loading", progress);
			});
		});
	}

	static parse(
		data: string,
		callback: (daeFile: DAEFile) => void,
		progress: (progress: number) => void = null
	): void {
		if (data == null || data === "") {
			callback(null);
			return;
		}
		if (progress == null) {
			progress = (progress: number) => {};
		}
		setTimeout(() => {
			var parser = new DOMParser();
			var document: Document = null;
			try {
				document = parser.parseFromString(data, "text/xml");
			} catch (err) {
				console.error("parse error", err);
				callback(null);
				return;
			}
			if (document == null) {
				console.error("parse error");
				callback(null);
				return;
			}
			if (document.getElementsByTagName("parsererror").length) {
				console.error("parse error");
				callback(null);
				return;
			}
			var file = new DAEFile();
			var $asset = document.querySelector("asset");
			file.asset = DAEAsset.parse($asset);
			var $libraryGeometries = document.querySelector("library_geometries");
			file.libraryGeometries = DAELibraryGeometries.parse($libraryGeometries);
			progress(1.0);
			callback(file);
		}, 0);
	}

	toMeshes(): Array<Tea.Mesh> {
		var geometries = this.libraryGeometries;
		if (geometries == null) {
			return null;
		}
		return geometries.toMeshes();
	}
}
