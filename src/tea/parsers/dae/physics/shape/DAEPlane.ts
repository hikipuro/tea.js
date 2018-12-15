import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape, surface (B-Rep)
export class DAEPlane {
	static readonly TagName: string = "plane";
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
			DAEUtil.queryChildSelector(el, "equation")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
