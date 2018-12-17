import { DAEConstant } from "./DAEConstant";
import { DAELambert } from "./DAELambert";
import { DAEPhong } from "./DAEPhong";
import { DAEBlinn } from "./DAEBlinn";

export interface DAEShaderElement {
	toXML(): Element;
}

export module DAEShaderElement {
	export function parseArray(el: Element): Array<DAEShaderElement> {
		if (el == null || el.childElementCount <= 0) {
			return null;
		}
		var elements = [];
		var el = el.firstElementChild;
		while (el != null) {
			var name = el.tagName;
			var child = null;
			switch (name) {
				case DAEConstant.TagName:
					child = DAEConstant.parse(el);
					break;
				case DAELambert.TagName:
					child = DAELambert.parse(el);
					break;
				case DAEPhong.TagName:
					child = DAEPhong.parse(el);
					break;
				case DAEBlinn.TagName:
					child = DAEBlinn.parse(el);
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
