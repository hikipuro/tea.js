import { DAEUtil } from "../DAEUtil";

// parent:
// core: formula
export class DAENewparam {
	sid: string;
	//annotate: any;
	//semantic: any;
	//modifier: any;
	data: any;

	constructor() {
		this.sid = "";
		this.data = null;
	}

	static parse(el: Element): DAENewparam {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENewparam();
		value.sid = DAEUtil.stringAttrib(el, "sid");
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

	static parseArray(parent: Element): Array<DAENewparam> {
		return DAEUtil.parseArray<DAENewparam>(
			this.parse, parent, "newparam"
		);
	}
}
