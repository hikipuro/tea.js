import { DAEUtil } from "../../DAEUtil";
import { DAETransformationElement } from "./DAETransformationElement";

// parent: node
export class DAEScale implements DAETransformationElement {
	static readonly TagName: string = "scale";
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAEScale {
		if (el == null) {
			return null;
		}
		var value = new DAEScale();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEScale.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
