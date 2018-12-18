import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEGeometricElement } from "./DAEGeometricElement";
import { DAEMesh } from "./DAEMesh";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_geometries
export class DAEGeometry {
	static readonly TagName: string = "geometry";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	geometricElement: DAEGeometricElement;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.geometricElement = null;
		this.extras = null;
	}

	static parse(el: Element): DAEGeometry {
		if (el == null) {
			return null;
		}
		var value = new DAEGeometry();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.geometricElement = DAEGeometricElement.parse(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toMesh(): Tea.Mesh {
		var mesh = this.geometricElement as DAEMesh;
		if (mesh == null) {
			return null;
		}
		return mesh.toMesh();
	}

	toXML(): Element {
		var el = document.createElement(DAEGeometry.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.geometricElement);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
