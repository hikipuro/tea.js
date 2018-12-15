import { DAEUtil } from "../../DAEUtil";

export class DAEFloatValue {
	tagName: string;
	sid?: string;
	data: number;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element, defaultValue: number = null): DAEFloatValue {
		var value = new DAEFloatValue();
		if (el == null) {
			//console.error("parse error");
			value.data = defaultValue;
			return value;
		}
		value.tagName = el.tagName;
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatContent(el);
		if (value.data == null) {
			value.data = defaultValue;
		}
		return value;
	}

	toXML(): Element {
		var tagName = this.tagName;
		if (tagName == null || tagName === "") {
			return null;
		}
		var el = document.createElement(tagName);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setTextContent(el, this.data.toString());
		return el;
	}
}
