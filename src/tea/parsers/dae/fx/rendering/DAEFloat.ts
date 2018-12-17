import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFloat {
	static readonly TagName: string = "float";
	sid?: string;
	data: number;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAEFloat {
		if (el == null) {
			return null;
		}
		var value = new DAEFloat();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getFloatContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFloat.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setFloatContent(el, this.data);
		return el;
	}
}
