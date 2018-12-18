import { DAELookat } from "./DAELookAt";
import { DAEMatrix } from "./DAEMatrix";
import { DAERotate } from "./DAERotate";
import { DAEScale } from "./DAEScale";
import { DAESkew } from "./DAESkew";
import { DAETranslate } from "./DAETranslate";

export interface DAETransformationElement {
	toXML(): Element;
}

export module DAETransformationElement {
	export function parseArray(el: Element): Array<DAETransformationElement> {
		if (el == null || el.childElementCount <= 0) {
			return null;
		}
		var elements = [];
		var el = el.firstElementChild;
		while (el != null) {
			var name = el.tagName;
			var child = null;
			switch (name) {
				case DAELookat.TagName:
					child = DAELookat.parse(el);
					break;
				case DAEMatrix.TagName:
					child = DAEMatrix.parse(el);
					break;
				case DAERotate.TagName:
					child = DAERotate.parse(el);
					break;
				case DAEScale.TagName:
					child = DAEScale.parse(el);
					break;
				case DAESkew.TagName:
					child = DAESkew.parse(el);
					break;
				case DAETranslate.TagName:
					child = DAETranslate.parse(el);
					break;
				/*
				case DAEAsset.TagName:
				case DAEInstanceCamera.TagName:
				case DAEInstanceController.TagName:
				case DAEInstanceGeometry.TagName:
				case DAEInstanceLight.TagName:
				case DAEInstanceNode.TagName:
				case DAENode.TagName:
				case DAEExtra.TagName:
					break;
				default:
					console.warn("unknown tag:", name);
					break;
				*/
			}
			if (child != null) {
				elements.push(child);
			}
			el = el.nextElementSibling;
		}
		return elements;
	}
}
