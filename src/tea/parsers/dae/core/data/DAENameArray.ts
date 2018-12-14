import { DAEUtil } from "../../DAEUtil";

// parent: source
export class DAENameArray {
	count: number;
	id?: string;
	name?: string;
	data: Array<string>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.data = [];
	}

	static parse(el: Element): DAENameArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENameArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.data = DAEUtil.stringArray(el);
		return value;
	}
}
