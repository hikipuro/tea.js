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
			return null;
		}
		var value = new DAEBoolArray();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.data = DAEUtil.getBoolArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBoolArray.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
