import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape
export class DAECylinder {
	static readonly TagName: string = "cylinder";
	height: number;
	radius: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.height = 0.0;
		this.radius = [];
		this.extras = null;
	}

	static parse(el: Element): DAECylinder {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECylinder();
		value.height = DAEUtil.floatContent(el, "height");
		value.radius = DAEUtil.floatArray(
			DAEUtil.queryChildSelector(el, "radius")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
