import { DAEUtil } from "../../DAEUtil";

// parent: node
export class DAESkew {
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAESkew {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESkew();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}
}