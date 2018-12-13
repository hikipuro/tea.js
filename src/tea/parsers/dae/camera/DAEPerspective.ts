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
			el.querySelector("xfov")
		);
		value.yfov = DAEFloatValue.parse(
			el.querySelector("yfov")
		);
		value.aspectRatio = DAEFloatValue.parse(
			el.querySelector("aspect_ratio")
		);
		value.znear = DAEFloatValue.parse(
			el.querySelector("znear")
		);
		value.zfar = DAEFloatValue.parse(
			el.querySelector("zfar")
		);
		return value;
	}
}
