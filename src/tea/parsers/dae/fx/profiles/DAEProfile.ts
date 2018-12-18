import { DAEUtil } from "../../DAEUtil";
import { DAEProfileBRIDGE } from "./DAEProfileBRIDGE";
import { DAEProfileCG } from "./DAEProfileCG";
import { DAEProfileCOMMON } from "./DAEProfileCOMMON";
import { DAEProfileGLES } from "./DAEProfileGLES";
import { DAEProfileGLES2 } from "./DAEProfileGLES2";
import { DAEProfileGLSL } from "./DAEProfileGLSL";

export interface DAEProfile {
	toXML(): Element;
}

export module DAEProfile {
	export function parse(el: Element): DAEProfile {
		if (el == null) {
			return null;
		}
		var element = DAEUtil.queryChildSelector(el, DAEProfileBRIDGE.TagName);
		if (element != null) {
			return DAEProfileBRIDGE.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEProfileCG.TagName);
		if (element != null) {
			return DAEProfileCG.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEProfileCOMMON.TagName);
		if (element != null) {
			return DAEProfileCOMMON.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEProfileGLES.TagName);
		if (element != null) {
			return DAEProfileGLES.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEProfileGLES2.TagName);
		if (element != null) {
			return DAEProfileGLES2.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEProfileGLSL.TagName);
		if (element != null) {
			return DAEProfileGLSL.parse(element);
		}
		return null;
	}

	export function parseArray(el: Element): Array<DAEProfile> {
		if (el == null || el.childElementCount <= 0) {
			return null;
		}
		var elements = [];
		var el = el.firstElementChild;
		while (el != null) {
			var name = el.tagName;
			var child = null;
			switch (name) {
				case DAEProfileBRIDGE.TagName:
					child = DAEProfileBRIDGE.parse(el);
					break;
				case DAEProfileCG.TagName:
					child = DAEProfileCG.parse(el);
					break;
				case DAEProfileCOMMON.TagName:
					child = DAEProfileCOMMON.parse(el);
					break;
				case DAEProfileGLES.TagName:
					child = DAEProfileGLES.parse(el);
					break;
				case DAEProfileGLES2.TagName:
					child = DAEProfileGLES2.parse(el);
					break;
				case DAEProfileGLSL.TagName:
					child = DAEProfileGLSL.parse(el);
					break;
				default:
					//console.warn("unknown tag:", name);
					break;
			}
			if (child != null) {
				elements.push(child);
			}
			el = el.nextElementSibling;
		}
		return elements;
	}
}
