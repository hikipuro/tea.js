import { DAEUtil } from "../../DAEUtil";
import { DAECone } from "./DAECone";
import { DAEPlane } from "../../physics/shape/DAEPlane";
import { DAECylinderBrep } from "./DAECylinderBrep";
import { DAENurbsSurface } from "./DAENurbsSurface";
import { DAESphere } from "../../physics/shape/DAESphere";
import { DAETorus } from "./DAETorus";
import { DAESweptSurface } from "./DAESweptSurface";

export interface DAESurfaceElement {
	toXML(): Element;
}

export module DAESurfaceElement {
	export function parse(el: Element): DAESurfaceElement {
		if (el == null) {
			return null;
		}
		var element = DAEUtil.queryChildSelector(el, DAECone.TagName);
		if (element != null) {
			return DAECone.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEPlane.TagName);
		if (element != null) {
			return DAEPlane.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAECylinderBrep.TagName);
		if (element != null) {
			return DAECylinderBrep.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAENurbsSurface.TagName);
		if (element != null) {
			return DAENurbsSurface.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAESphere.TagName);
		if (element != null) {
			return DAESphere.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAETorus.TagName);
		if (element != null) {
			return DAETorus.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAESweptSurface.TagName);
		if (element != null) {
			return DAESweptSurface.parse(element);
		}
		return null;
	}
}
