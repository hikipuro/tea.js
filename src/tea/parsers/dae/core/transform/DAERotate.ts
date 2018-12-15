import { DAEUtil } from "../../DAEUtil";
import { DAETransformationElement } from "./DAETransformationElement";

// parent:
// core: node
export class DAERotate implements DAETransformationElement {
	static readonly TagName: string = "rotate";
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAERotate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERotate();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERotate> {
		return DAEUtil.parseArray<DAERotate>(
			this.parse, parent, DAERotate.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAERotate.TagName);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
