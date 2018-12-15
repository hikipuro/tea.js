import { DAEUtil } from "../../DAEUtil";
import { DAETransformationElement } from "./DAETransformationElement";

// parent:
// core: node
export class DAETranslate implements DAETransformationElement {
	static readonly TagName: string = "translate";
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAETranslate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETranslate();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAETranslate> {
		return DAEUtil.parseArray<DAETranslate>(
			this.parse, parent, DAETranslate.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETranslate.TagName);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
