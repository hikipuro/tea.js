import { DAEUtil } from "../DAEUtil";

// parent: node
export class DAEScale {
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAEScale {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEScale();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}
}
