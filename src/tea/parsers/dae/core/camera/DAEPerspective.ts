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
			//console.error("parse error");
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
		DAEUtil.addXML(el, this.xfov);
		DAEUtil.addXML(el, this.yfov);
		DAEUtil.addXML(el, this.aspectRatio);
		DAEUtil.addXML(el, this.znear);
		DAEUtil.addXML(el, this.zfar);
		return el;
	}
}
