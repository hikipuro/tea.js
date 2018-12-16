import { DAEUtil } from "../../DAEUtil";
import { DAETransformationElement } from "./DAETransformationElement";

// parent: node
export class DAELookat implements DAETransformationElement {
	static readonly TagName: string = "Lookat";
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAELookat {
		if (el == null) {
			return null;
		}
		var value = new DAELookat();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELookat.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
