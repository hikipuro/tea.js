import { DAEUtil } from "../../DAEUtil";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: optics / technique_common
export class DAEOrthographic {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEOrthographic();
		value.xmag = DAEFloatValue.parse(
			el.querySelector(":scope > xmag")
		);
		value.ymag = DAEFloatValue.parse(
			el.querySelector(":scope > ymag")
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
		var el = document.createElement("orthographic");
		DAEUtil.addXML(el, this.xmag);
		DAEUtil.addXML(el, this.ymag);
		DAEUtil.addXML(el, this.aspectRatio);
		DAEUtil.addXML(el, this.znear);
		DAEUtil.addXML(el, this.zfar);
		return el;
	}
}
