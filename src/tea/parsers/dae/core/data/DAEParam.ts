import { DAEUtil } from "../../DAEUtil";

// parent: accessor, bind_material
// *
export class DAEParam {
	name?: string;
	sid?: string;
	type: string;
	semantic?: string;

	constructor() {
		this.name = null;
		this.sid = null;
		this.type = null;
		this.semantic = null;
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
		return value;
	}

	static parseArray(parent: Element): Array<DAEParam> {
		return DAEUtil.parseArray<DAEParam>(
			this.parse, parent, "param"
		);
	}

	toXML(): Element {
		var el = document.createElement("param");
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "type", this.type);
		DAEUtil.setAttribute(el, "semantic", this.semantic);
		return el;
	}
}
