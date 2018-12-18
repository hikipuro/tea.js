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
			return null;
		}
		var value = new DAEBindAttribute();
		value.symbol = DAEUtil.getStringAttr(el, "symbol");
		value.semantic = DAEUtil.getStringContent(el, "semantic");
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindAttribute> {
		return DAEUtil.parseArray<DAEBindAttribute>(
			this.parse, parent, DAEBindAttribute.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindAttribute.TagName);
		DAEUtil.setAttr(el, "symbol", this.symbol);
		DAEUtil.addStringContent(el, "semantic", this.semantic);
		return el;
	}
}
