import { DAEUtil } from "../../DAEUtil";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";
import { DAEInstanceImage } from "../texturing/DAEInstanceImage";

// parent: evaluate
export class DAEColorTarget {
	static readonly TagName: string = "color_target";
	index?: number;
	slice?: number;
	mip?: number;
	face?: string;
	param?: DAEParamRef;
	instanceImage?: DAEInstanceImage;

	constructor() {
		this.index = 0;
		this.slice = 0;
		this.mip = 0;
		this.face = "POSITIVE_X";
		this.param = null;
		this.instanceImage = null;
	}

	static parse(el: Element): DAEColorTarget {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEColorTarget();
		value.index = DAEUtil.getIntAttr(el, "index", 0);
		value.slice = DAEUtil.getIntAttr(el, "slice", 0);
		value.mip = DAEUtil.getIntAttr(el, "mip", 0);
		value.face = DAEUtil.getStringAttr(el, "face", "POSITIVE_X");
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		value.instanceImage = DAEInstanceImage.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceImage.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColorTarget.TagName);
		return el;
	}
}
