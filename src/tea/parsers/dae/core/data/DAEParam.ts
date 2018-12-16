import { DAEUtil } from "../../DAEUtil";

// parent: accessor, bind_material
// *
export class DAEParam {
	static readonly TagName: string = "param";
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
			return null;
		}
		var value = new DAEParam();
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.type = DAEUtil.getStringAttr(el, "type");
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		return value;
	}

	static parseArray(parent: Element): Array<DAEParam> {
		return DAEUtil.parseArray<DAEParam>(
			this.parse, parent, DAEParam.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEParam.TagName);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "type", this.type);
		DAEUtil.setAttr(el, "semantic", this.semantic);
		return el;
	}
}
