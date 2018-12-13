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
			el.querySelector("xmag")
		);
		value.ymag = DAEFloatValue.parse(
			el.querySelector("ymag")
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
