import { DAEUtil } from "../../DAEUtil";

// parent:
// core: node
export class DAETranslate {
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAETranslate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETranslate();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAETranslate> {
		return DAEUtil.parseArray<DAETranslate>(
			this.parse, parent, "translate"
		);
	}
}
