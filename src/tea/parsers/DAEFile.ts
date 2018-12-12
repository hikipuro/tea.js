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
			if (this.isValidDocument(document) === false) {
				console.error("parse error");
				callback(null);
				return;
			}
			var file = new DAEFile();
			var $asset = document.querySelector("asset");
			file.asset = DAEAsset.parse($asset);
			var $libraryGeometries = document.querySelector("library_geometries");
			DAELibraryGeometries.parse($libraryGeometries, (geometries: DAELibraryGeometries) => {
				file.libraryGeometries = geometries;
				progress(1.0);
				callback(file);
				console.log("xml", file.toXML());
			});
		}, 0);
	}

	toMeshes(): Array<Tea.Mesh> {
		var geometries = this.libraryGeometries;
		if (geometries == null) {
			return null;
		}
		return geometries.toMeshes();
	}

	toXML(): Document {
		var doc = document.implementation.createDocument(
			"", "", null
		);
		var root = doc.createElement("COLLADA");
		root.setAttribute("xmlns", "http://www.collada.org/2005/11/COLLADASchema");
		root.setAttribute("version", "1.4.1");
		root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		var asset = this.asset.toXML();
		root.appendChild(asset);
		var libraryGeometries = this.libraryGeometries.toXML();
		root.appendChild(libraryGeometries);
		doc.appendChild(root);
		return doc;
	}

	protected static isValidDocument(document: Document): boolean {
		if (document == null) {
			return false;
		}
		if (document.children.length <= 0) {
			return false;
		}
		if (document.children[0].nodeName !== "COLLADA") {
			return false;
		}
		if (document.getElementsByTagName("parsererror").length > 0) {
			return false;
		}
		return true;
	}
}
