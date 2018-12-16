import { DAEUtil } from "../../DAEUtil";

// parent: program
export class DAEBindAttribute {
	static readonly TagName: string = "bind_attribute";
	symbol: string;
	semantic: string;

	constructor() {
		this.symbol = null;
		this.semantic = null;
	}

	static parse(el: Element): DAEBindAttribute {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindAttribute();
		value.symbol = DAEUtil.getStringAttr(el, "symbol");
		value.semantic = DAEUtil.getStringContent(el, "semantic");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindAttribute.TagName);
		return el;
	}
}
