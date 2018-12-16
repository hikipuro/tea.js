import { DAEUtil } from "../../DAEUtil";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: optics / technique_common
export class DAEPerspective {
	static readonly TagName: string = "perspective";
	xfov: DAEFloatValue;
	yfov: DAEFloatValue;
	aspectRatio?: DAEFloatValue;
	znear?: DAEFloatValue;
	zfar?: DAEFloatValue;

	constructor() {
		this.xfov = null;
		this.yfov = null;
		this.aspectRatio = null;
		this.znear = null;
		this.zfar = null;
	}

	static parse(el: Element): DAEPerspective {
		if (el == null) {
			return null;
		}
		var value = new DAEPerspective();
		value.xfov = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "xfov")
		);
		value.yfov = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "yfov")
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
		var el = document.createElement(DAEPerspective.TagName);
		DAEUtil.addElement(el, this.xfov);
		DAEUtil.addElement(el, this.yfov);
		DAEUtil.addElement(el, this.aspectRatio);
		DAEUtil.addElement(el, this.znear);
		DAEUtil.addElement(el, this.zfar);
		return el;
	}
}
