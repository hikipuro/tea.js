import * as Tea from "../../Tea";
import { DAEAsset } from "./DAEAsset";
import { DAEGeometry } from "./DAEGeometry";

export class DAELibraryGeometries {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	geometries: Array<DAEGeometry>;
	//extra?: DAEExtra;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.geometries = [];
	}

	static parse(el: Element, callback: (geometries: DAELibraryGeometries) => void): void {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var libraryGeometries = new DAELibraryGeometries();
		libraryGeometries.id = el.id;
		libraryGeometries.name = el.getAttribute("name");
		var $geometries = el.querySelectorAll("geometry");
		var length = $geometries.length;
		var parse = ($geometries: NodeListOf<Element>, index: number) => {
			if (index >= length) {
				callback(libraryGeometries);
				return;
			}
			var $geometry = $geometries[index];
			var geometry = DAEGeometry.parse($geometry);
			if (geometry == null) {
				parse($geometries, index + 1);
				return;
			}
			libraryGeometries.geometries.push(geometry);
			if (index % 100 === 0) {
				setTimeout(() => {
					parse($geometries, index + 1);
				}, 0);
				return;
			}
			parse($geometries, index + 1);
		};
		parse($geometries, 0);
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
