import * as Tea from "../../../../Tea";
import { DAEUtil } from "./../../DAEUtil";

// parent: source
export class DAEFloatArray {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEFloatArray();
		value.count = DAEUtil.intAttrib(el, "count");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.digits = DAEUtil.intAttrib(el, "digits");
		value.digits = this.clampDigits(value.digits);
		value.magnitude = DAEUtil.intAttrib(el, "magnitude");
		value.magnitude = this.clampDigits(value.magnitude);
		value.data = DAEUtil.floatArray(el);
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
