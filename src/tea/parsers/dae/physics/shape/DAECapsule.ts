import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape
export class DAECapsule {
	height: number;
	radius: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.height = 0.0;
		this.radius = [];
		this.extras = null;
	}

	static parse(el: Element): DAECapsule {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECapsule();
		value.height = DAEUtil.floatContent(el, "height");
		value.radius = DAEUtil.floatArray(
			el.querySelector(":scope > radius")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
