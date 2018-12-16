import { DAEUtil } from "../../DAEUtil";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: optics / technique_common
export class DAEOrthographic {
	static readonly TagName: string = "orthographic";
	xmag?: DAEFloatValue;
	ymag?: DAEFloatValue;
	aspectRatio?: DAEFloatValue;
	znear?: DAEFloatValue;
	zfar?: DAEFloatValue;

	constructor() {
		this.xmag = null;
		this.ymag = null;
		this.aspectRatio = null;
		this.znear = null;
		this.zfar = null;
	}

	static parse(el: Element): DAEOrthographic {
		if (el == null) {
			return null;
		}
		var value = new DAEOrthographic();
		value.xmag = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "xmag")
		);
		value.ymag = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "ymag")
		);
		value.aspectRatio = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "aspect_ratio")
		);
		value.znear = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "znear")
		);
		value.zfar = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "zfar")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEOrthographic.TagName);
		DAEUtil.addElement(el, this.xmag);
		DAEUtil.addElement(el, this.ymag);
		DAEUtil.addElement(el, this.aspectRatio);
		DAEUtil.addElement(el, this.znear);
		DAEUtil.addElement(el, this.zfar);
		return el;
	}
}
