import { DAEUtil } from "../../DAEUtil";
import { DAELine } from "./DAELine";
import { DAECircle } from "./DAECircle";
import { DAEEllipse } from "./DAEEllipse";
import { DAEParabola } from "./DAEParabola";
import { DAEHyperbola } from "./DAEHyperbola";
import { DAENurbs } from "./DAENurbs";

export interface DAECurveElement {
	toXML(): Element;
}

export module DAECurveElement {
	export function parse(el: Element): DAECurveElement {
		if (el == null) {
			return null;
		}
		var element = DAEUtil.queryChildSelector(el, DAELine.TagName);
		if (element != null) {
			return DAELine.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAECircle.TagName);
		if (element != null) {
			return DAECircle.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEEllipse.TagName);
		if (element != null) {
			return DAEEllipse.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEParabola.TagName);
		if (element != null) {
			return DAEParabola.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEHyperbola.TagName);
		if (element != null) {
			return DAEHyperbola.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAENurbs.TagName);
		if (element != null) {
			return DAENurbs.parse(element);
		}
		return null;
	}
}
