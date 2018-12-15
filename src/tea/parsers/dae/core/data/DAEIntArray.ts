import { DAEUtil } from "../../DAEUtil";
import { DAEArrayElement } from "./DAEArrayElement";

// parent: source (core)
export class DAEIntArray implements DAEArrayElement {
	static readonly TagName: string = "int_array";
	static readonly DefaultMinInclusive: number = -2147483648;
	static readonly DefaultMaxInclusive: number = 2147483647;
	count: number;
	id?: string;
	name?: string;
	minInclusive?: number;
	maxInclusive?: number;
	data: Array<number>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.minInclusive = DAEIntArray.DefaultMinInclusive;
		this.maxInclusive = DAEIntArray.DefaultMaxInclusive;
		this.data = [];
	}

	static parse(el: Element): DAEIntArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEIntArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.minInclusive = DAEUtil.intAttrib(el, "minInclusive");
		value.maxInclusive = DAEUtil.intAttrib(el, "maxInclusive");
		value.data = DAEUtil.intArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEIntArray.TagName);
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "minInclusive", this.minInclusive);
		DAEUtil.setAttribute(el, "maxInclusive", this.maxInclusive);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
