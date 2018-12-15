import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEGeometricElement } from "./DAEGeometricElement";
import { DAEConvexMesh } from "../../physics/shape/DAEConvexMesh";
import { DAEMesh } from "./DAEMesh";
import { DAESpline } from "./DAESpline";
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEGeometry();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.geometricElement = DAEGeometry.parseGeometricElement(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	protected static parseGeometricElement(el: Element): DAEGeometricElement {
		var element = DAEUtil.queryChildSelector(el, DAEConvexMesh.TagName);
		if (element != null) {
			return DAEConvexMesh.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEMesh.TagName);
		if (element != null) {
			return DAEMesh.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAESpline.TagName);
		if (element != null) {
			return DAESpline.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, "brep");
		if (element != null) {
			//return DAEBRep.parse(element);
		}
		return null;
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
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.geometricElement);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
