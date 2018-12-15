import { DAEUtil } from "../../DAEUtil";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: optics / technique_common
export class DAEPerspective {
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
			el.querySelector(":scope > xfov")
		);
		value.yfov = DAEFloatValue.parse(
			el.querySelector(":scope > yfov")
		);
		value.aspectRatio = DAEFloatValue.parse(
			el.querySelector(":scope > aspect_ratio")
		);
		value.znear = DAEFloatValue.parse(
			el.querySelector(":scope > znear")
		);
		value.zfar = DAEFloatValue.parse(
			el.querySelector(":scope > zfar")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("perspective");
		DAEUtil.addXML(el, this.xfov);
		DAEUtil.addXML(el, this.yfov);
		DAEUtil.addXML(el, this.aspectRatio);
		DAEUtil.addXML(el, this.znear);
		DAEUtil.addXML(el, this.zfar);
		return el;
	}
}
