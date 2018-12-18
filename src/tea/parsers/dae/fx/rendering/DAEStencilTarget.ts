import { DAEUtil } from "../../DAEUtil";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";
import { DAEInstanceImage } from "../texturing/DAEInstanceImage";

// parent: evaluate
export class DAEStencilTarget {
	static readonly TagName: string = "stencil_target";
	index?: number;
	slice?: number;
	mip?: number;
	face?: string;
	param?: DAEParamRef;
	instanceImage?: DAEInstanceImage;

	constructor() {
		this.index = 1;
		this.slice = 0;
		this.mip = 0;
		this.face = null;
		this.param = null;
		this.instanceImage = null;
	}

	static parse(el: Element): DAEStencilTarget {
		if (el == null) {
			return null;
		}
		var value = new DAEStencilTarget();
		value.index = DAEUtil.getIntAttr(el, "index", 1);
		value.slice = DAEUtil.getIntAttr(el, "slice", 0);
		value.mip = DAEUtil.getIntAttr(el, "mip", 0);
		value.face = DAEUtil.getStringAttr(el, "face");
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		value.instanceImage = DAEInstanceImage.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceImage.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStencilTarget.TagName);
		DAEUtil.setAttr(el, "index", this.index, 1);
		DAEUtil.setAttr(el, "slice", this.slice, 0);
		DAEUtil.setAttr(el, "mip", this.mip, 0);
		DAEUtil.setAttr(el, "face", this.face);
		DAEUtil.addElement(el, this.param);
		DAEUtil.addElement(el, this.instanceImage);
		return el;
	}
}
