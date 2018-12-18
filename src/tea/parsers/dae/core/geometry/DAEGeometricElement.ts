import { DAEUtil } from "../../DAEUtil";
import { DAEConvexMesh } from "../../physics/shape/DAEConvexMesh";
import { DAEMesh } from "./DAEMesh";
import { DAESpline } from "./DAESpline";
import { DAEBrep } from "../../brep/geometry/DAEBrep";

export interface DAEGeometricElement {
	toXML(): Element;
}

export module DAEGeometricElement {
	export function parse(el: Element): DAEGeometricElement {
		if (el == null) {
			return null;
		}
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
		element = DAEUtil.queryChildSelector(el, DAEBrep.TagName);
		if (element != null) {
			return DAEBrep.parse(element);
		}
		return null;
	}
}
