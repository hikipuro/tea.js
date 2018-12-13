import { DAEUtil } from "../DAEUtil";

export class DAENewparam {

	constructor() {
	}

	static parse(el: Element): DAENewparam {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAENewparam();
		return value;
	}

	static parseArray(parent: Element): Array<DAENewparam> {
		return DAEUtil.parseArray<DAENewparam>(
			this.parse, parent, "newparam"
		);
	}
}
