import { DAEUtil } from "../../DAEUtil";
import { DAEArgument } from "./DAEArgument";

// parent: texcombiner
export class DAERGB {
	static readonly TagName: string = "RGB";
	operator: string;
	scale: number;
	arguments: Array<DAEArgument>;

	constructor() {
		this.operator = null;
		this.scale = null;
		this.arguments = null;
	}

	static parse(el: Element): DAERGB {
		if (el == null) {
			return null;
		}
		var value = new DAERGB();
		value.operator = DAEUtil.getStringAttr(el, "operator");
		value.scale = DAEUtil.getFloatAttr(el, "scale");
		value.arguments = DAEArgument.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERGB.TagName);
		DAEUtil.setAttr(el, "operator", this.operator);
		DAEUtil.setAttr(el, "scale", this.scale);
		DAEUtil.addElementArray(el, this.arguments);
		return el;
	}
}
