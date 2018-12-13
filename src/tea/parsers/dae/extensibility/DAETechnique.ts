import { DAEUtil } from "../DAEUtil";

export class DAETechnique {
	id?: string;
	sid: string;

	constructor() {
		this.id = null;
		this.sid = null;
	}

	static parse(el: Element): DAETechnique {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETechnique();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.sid = DAEUtil.stringAttrib(el, "sid");
		return value;
	}

	static parseArray(parent: Element): Array<DAETechnique> {
		return DAEUtil.parseArray<DAETechnique>(
			this.parse, parent, "technique"
		);
	}
}
