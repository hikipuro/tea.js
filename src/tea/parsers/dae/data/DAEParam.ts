import { DAEUtil } from "./../DAEUtil";

export class DAEParam {
	name: string;
	type: string;

	constructor() {
		this.name = "";
		this.type = "";
	}

	static parse(el: Element): DAEParam {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEParam();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.type = DAEUtil.stringAttrib(el, "type");
		return value;
	}

	static parseArray(parent: Element): Array<DAEParam> {
		return DAEUtil.parseArray<DAEParam>(
			this.parse, parent, "param"
		);
	}
}
