import * as Tea from "../../Tea";
import { DaeAsset } from "./DaeAsset";
import { DaeLibraryGeometries } from "./DaeLibraryGeometries";

export class DaeDocument {
	asset: DaeAsset;
	libraryGeometries: DaeLibraryGeometries;

	constructor() {
		this.asset = null;
		this.libraryGeometries = null;
	}

	static parse(doc: Document): DaeDocument {
		if (doc == null) {
			console.error("parse error");
			return null;
		}
		var document = new DaeDocument();
		var $asset = doc.querySelector("asset");
		document.asset = DaeAsset.parse($asset);
		var $libraryGeometries = doc.querySelector("library_geometries");
		document.libraryGeometries = DaeLibraryGeometries.parse($libraryGeometries);
		return document;
	}

	toMeshes(): Array<Tea.Mesh> {
		var geometries = this.libraryGeometries;
		if (geometries == null) {
			return null;
		}
		return geometries.toMeshes();
	}
}
