import { DAEUtil } from "../../DAEUtil";
import { DAEArrayElement } from "./DAEArrayElement";

// parent: source (core)
export class DAENameArray implements DAEArrayElement {
	count: number;
	id?: string;
	name?: string;
	data: Array<string>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.data = [];
	}

	static parse(el: Element): DAENameArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENameArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.data = DAEUtil.stringArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("Name_array");
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
