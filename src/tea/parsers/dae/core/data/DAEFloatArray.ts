import * as Tea from "../../../../Tea";
import { DAEUtil } from "./../../DAEUtil";
import { DAEArrayElement } from "./DAEArrayElement";

// parent: source
export class DAEFloatArray implements DAEArrayElement {
	static readonly TagName: string = "float_array";
	static readonly DefaultDigits: number = 6;
	static readonly DefaultMagnitude: number = 38;
	count: number;
	id?: string;
	name?: string;
	digits?: number;
	magnitude?: number;
	data: Array<number>;

	constructor() {
		this.count = 0;
		this.id = null;
		this.name = null;
		this.digits = DAEFloatArray.DefaultDigits;
		this.magnitude = DAEFloatArray.DefaultMagnitude;
		this.data = [];
	}

	static parse(el: Element): DAEFloatArray {
		if (el == null) {
			return null;
		}
		var value = new DAEFloatArray();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.digits = DAEUtil.getIntAttr(el, "digits");
		value.digits = this.clampDigits(value.digits);
		value.magnitude = DAEUtil.getIntAttr(el, "magnitude");
		value.magnitude = this.clampMagnitude(value.magnitude);
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	static clampDigits(digits: number): number {
		if (digits == null || isNaN(digits)) {
			return DAEFloatArray.DefaultDigits;
		}
		return Math.max(1, Math.min(17, digits));
	}

	static clampMagnitude(magnitude: number): number {
		if (magnitude == null || isNaN(magnitude)) {
			return DAEFloatArray.DefaultMagnitude;
		}
		return Math.max(-324, Math.min(308, magnitude));
	}

	toXML(): Element {
		var el = document.createElement(DAEFloatArray.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		var digits = DAEFloatArray.clampDigits(this.digits);
		DAEUtil.setAttr(el, "digits", digits, DAEFloatArray.DefaultDigits);
		var magnitude = DAEFloatArray.clampMagnitude(this.magnitude);
		DAEUtil.setAttr(el, "magnitude", magnitude, DAEFloatArray.DefaultMagnitude);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}

	toVector3Array(): Array<Tea.Vector3> {
		var data = this.data;
		if (data == null || data.length <= 0) {
			return null;
		}
		var array = [];
		var length = data.length;
		for (var i = 0; i < length; i += 3) {
			var x = data[i];
			var y = data[i + 1];
			var z = data[i + 2];
			var v = new Tea.Vector3(x, y, z);
			array.push(v);
		}
		return array;
	}
}
