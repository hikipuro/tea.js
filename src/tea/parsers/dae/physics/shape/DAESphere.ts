import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape, surface (B-Rep)
export class DAESphere {
	radius: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.radius = null;
		this.extras = null;
	}

	static parse(el: Element): DAESphere {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESphere();
		value.radius = DAEUtil.floatContent(el, "radius");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
