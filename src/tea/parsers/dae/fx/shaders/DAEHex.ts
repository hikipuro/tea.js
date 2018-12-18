import { DAEUtil } from "../../DAEUtil";

// parent: binary
export class DAEHex {
	static readonly TagName: string = "hex";
	format: string;
	data: string;

	constructor() {
		this.format = null;
		this.data = null;
	}

	static parse(el: Element): DAEHex {
		if (el == null) {
			return null;
		}
		var value = new DAEHex();
		value.format = DAEUtil.getStringAttr(el, "format");
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEHex.TagName);
		DAEUtil.setAttr(el, "format", this.format);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
