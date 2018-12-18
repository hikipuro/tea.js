import { DAEUtil } from "../../DAEUtil";
import { DAEArgument } from "./DAEArgument";

// parent: texcombiner
export class DAEAlpha {
	static readonly TagName: string = "alpha";
	operator?: string;
	scale?: string;
	arguments: Array<DAEArgument>;

	constructor() {
		this.operator = null;
		this.scale = null;
		this.arguments = null;
	}

	static parse(el: Element): DAEAlpha {
		if (el == null) {
			return null;
		}
		var value = new DAEAlpha();
		value.operator = DAEUtil.getStringAttr(el, "operator");
		value.scale = DAEUtil.getStringAttr(el, "scale");
		value.arguments = DAEArgument.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAlpha.TagName);
		DAEUtil.setAttr(el, "operator", this.operator);
		DAEUtil.setAttr(el, "scale", this.scale);
		DAEUtil.addElementArray(el, this.arguments);
		return el;
	}
}
