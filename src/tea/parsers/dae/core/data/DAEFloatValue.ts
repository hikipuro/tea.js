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
			value.data = defaultValue;
			return value;
		}
		value.tagName = el.tagName;
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getFloatContent(el);
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
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setStringContent(el, this.data.toString());
		return el;
	}
}
