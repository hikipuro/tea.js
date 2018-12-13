import { DAEUtil } from "../DAEUtil";

// parent:
// core: instance_formula
export class DAESetparam {
	ref: string;
	data: any;

	constructor() {
		this.ref = "";
		this.data = null;
	}

	static parse(el: Element): DAESetparam {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESetparam();
		value.ref = DAEUtil.stringAttrib(el, "ref");
		value.data = DAEUtil.floatContent(el, "float");
		if (value.data == null) {
			value.data = DAEUtil.intContent(el, "int");
		}
		if (value.data == null) {
			value.data = DAEUtil.boolContent(el, "bool");
		}
		if (value.data == null) {
			value.data = DAEUtil.textContent(el, "SIDREF");
		}
		return value;
	}

	static parseArray(parent: Element): Array<DAESetparam> {
		return DAEUtil.parseArray<DAESetparam>(
			this.parse, parent, "setparam"
		);
	}
}
