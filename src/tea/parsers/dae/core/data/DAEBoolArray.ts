import { DAEUtil } from "../../DAEUtil";
import { DAEArrayElement } from "./DAEArrayElement";

// parent: source (core)
export class DAEBoolArray implements DAEArrayElement {
	static readonly TagName: string = "bool_array";
	count: number;
	id?: string;
	name?: string;
	data: Array<boolean>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.data = [];
	}

	static parse(el: Element): DAEBoolArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBoolArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.data = DAEUtil.boolArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBoolArray.TagName);
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
