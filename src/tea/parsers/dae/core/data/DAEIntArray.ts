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
			return null;
		}
		var value = new DAEIntArray();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.minInclusive = DAEUtil.getIntAttr(el, "minInclusive");
		value.maxInclusive = DAEUtil.getIntAttr(el, "maxInclusive");
		value.data = DAEUtil.getIntArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEIntArray.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "minInclusive", this.minInclusive);
		DAEUtil.setAttr(el, "maxInclusive", this.maxInclusive);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
