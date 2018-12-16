import { DAEUtil } from "../../DAEUtil";
import { DAEArrayElement } from "./DAEArrayElement";

// parent: source (core)
export class DAENameArray implements DAEArrayElement {
	static readonly TagName: string = "Name_array";
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
			return null;
		}
		var value = new DAENameArray();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.data = DAEUtil.getStringArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAENameArray.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
