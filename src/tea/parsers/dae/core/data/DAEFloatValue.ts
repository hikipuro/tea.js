import { DAEUtil } from "../../DAEUtil";

export class DAEFloatValue {
	sid?: string;
	data: number;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element, defaultValue: number = null): DAEFloatValue {
		var value = new DAEFloatValue();
		if (el == null) {
			//console.error("parse error");
			value.data = defaultValue;
			return value;
		}
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatContent(el);
		if (value.data == null) {
			value.data = defaultValue;
		}
		return value;
	}
}
