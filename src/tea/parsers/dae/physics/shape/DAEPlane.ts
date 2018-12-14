import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape, surface (B-Rep)
export class DAEPlane {
	equation: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.equation = [];
		this.extras = null;
	}

	static parse(el: Element): DAEPlane {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPlane();
		value.equation = DAEUtil.floatArray(
			el.querySelector(":scope > equation")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
