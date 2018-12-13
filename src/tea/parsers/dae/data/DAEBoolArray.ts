import { DAEUtil } from "../DAEUtil";

// parent: source
export class DAEBoolArray {
	count: number;
	id?: string;
	name?: string;
	data: Array<boolean>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.data = [];
	}

	static parse(el: Element): DAEBoolArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBoolArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.data = DAEUtil.boolArray(el);
		return value;
	}
}
