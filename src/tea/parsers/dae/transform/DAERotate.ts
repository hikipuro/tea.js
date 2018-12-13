import { DAEUtil } from "../DAEUtil";

// parent:
// core: node
export class DAERotate {
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAERotate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERotate();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}
}
