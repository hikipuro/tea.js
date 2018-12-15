import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape
export class DAEBox {
	static readonly TagName: string = "box";
	halfExtents: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.halfExtents = null;
		this.extras = null;
	}

	static parse(el: Element): DAEBox {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBox();
		value.halfExtents = DAEUtil.floatArray(
			DAEUtil.queryChildSelector(el, "half_extents")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
