import * as Tea from "../../Tea";
import { DAEGeometry } from "./DAEGeometry";

export class DAELibraryGeometries {
	geometries: Array<DAEGeometry>;

	constructor() {
		this.geometries = [];
	}

	static parse(el: Element): DAELibraryGeometries {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var libraryGeometries = new DAELibraryGeometries();
		var $geometries = el.querySelectorAll("geometry");
		for (var i = 0; i < $geometries.length; i++) {
			var $geometry = $geometries[i];
			var geometry = DAEGeometry.parse($geometry);
			if (geometry == null) {
				continue;
			}
			libraryGeometries.geometries.push(geometry);
		}
		return libraryGeometries;
	}

	toMeshes(): Array<Tea.Mesh> {
		var geometries = this.geometries;
		if (geometries == null || geometries.length <= 0) {
			return null;
		}
		var array = [];
		var length = geometries.length;
		for (var i = 0; i < length; i++) {
			var geometry = geometries[i];
			var meshes = geometry.toMeshes();
			if (meshes == null) {
				continue;
			}
			array.push(...meshes);
		}
		return array;
	}
}
