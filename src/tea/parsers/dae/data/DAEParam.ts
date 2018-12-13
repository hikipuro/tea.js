import { DAEUtil } from "./../DAEUtil";

// parent: accessor, bind_material
// *
export class DAEParam {
	name?: string;
	sid?: string;
	type: string;
	semantic?: string;

	ref: string;

	constructor() {
		this.name = null;
		this.sid = null;
		this.type = null;
		this.semantic = null;
		this.ref = null;
	}

	static parse(el: Element): DAEParam {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEParam();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.type = DAEUtil.stringAttrib(el, "type");
		value.semantic = DAEUtil.stringAttrib(el, "semantic");
		value.ref = DAEUtil.stringAttrib(el, "ref");
		return value;
	}

	static parseArray(parent: Element): Array<DAEParam> {
		return DAEUtil.parseArray<DAEParam>(
			this.parse, parent, "param"
		);
	}
}
