import { DAEUtil } from "../../DAEUtil";
import { DAEBoolArray } from "./DAEBoolArray";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAEIDREFArray } from "./DAEIDREFArray";
import { DAEIntArray } from "./DAEIntArray";
import { DAENameArray } from "./DAENameArray";
import { DAESIDREFArray } from "./DAESIDREFArray";

export interface DAEArrayElement {
	toXML(): Element;
}

export module DAEArrayElement {
	export function parse(el: Element): DAEArrayElement {
		if (el == null) {
			return null;
		}
		var element = DAEUtil.queryChildSelector(el, DAEBoolArray.TagName);
		if (element != null) {
			return DAEBoolArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEFloatArray.TagName);
		if (element != null) {
			return DAEFloatArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEIDREFArray.TagName);
		if (element != null) {
			return DAEIDREFArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEIntArray.TagName);
		if (element != null) {
			return DAEIntArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAENameArray.TagName);
		if (element != null) {
			return DAENameArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAESIDREFArray.TagName);
		if (element != null) {
			return DAESIDREFArray.parse(element);
		}
		//element = DAEUtil.queryChildSelector(el, DAETokenArray.TagName);
		//if (element != null) {
			//return DAETokenArray.parse(element);
		//}
		return null;
	}
}
