import { DAEUtil } from "../DAEUtil";

export class DAESetparam {

	constructor() {
	}

	static parse(el: Element): DAESetparam {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESetparam();
		return value;
	}

	static parseArray(parent: Element): Array<DAESetparam> {
		return DAEUtil.parseArray<DAESetparam>(
			this.parse, parent, "setparam"
		);
	}
}
