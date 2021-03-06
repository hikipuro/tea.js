import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEGeometry } from "./DAEGeometry";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryGeometries {
	static readonly TagName: string = "library_geometries";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	geometries: Array<DAEGeometry>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.geometries = [];
		this.extras = null;
	}

	static parse(el: Element, callback: (geometries: DAELibraryGeometries) => void): void {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryGeometries();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		var $geometries = el.querySelectorAll(":scope > geometry");
		var length = $geometries.length;
		var parse = ($geometries: NodeListOf<Element>, index: number) => {
			if (index >= length) {
				callback(value);
				return;
			}
			var geometry = DAEGeometry.parse(
				$geometries[index]
			);
			if (geometry == null) {
				parse($geometries, index + 1);
				return;
			}
			value.geometries.push(geometry);
			if (index % 100 === 0) {
				setTimeout(() => {
					parse($geometries, index + 1);
				}, 0);
				return;
			}
			parse($geometries, index + 1);
		};
		parse($geometries, 0);
		value.extras = DAEExtra.parseArray(el);
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
			var mesh = geometry.toMesh();
			if (mesh == null) {
				continue;
			}
			array.push(mesh);
		}
		return array;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryGeometries.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.geometries);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
