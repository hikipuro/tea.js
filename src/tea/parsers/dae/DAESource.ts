import * as Tea from "../../Tea";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAETechniqueCommon } from "./DAETechniqueCommon";
import { DAEUtil } from "./DAEUtil";

export class DAESource {
	id: string;
	floatArray: DAEFloatArray;
	techniqueCommon: DAETechniqueCommon;

	constructor() {
		this.id = "";
		this.floatArray = null;
		this.techniqueCommon = null;
	}

	static parse(el: Element): DAESource {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var source = new DAESource();
		source.id = el.id;
		var $float_array = el.querySelector("float_array");
		var floatArray = DAEFloatArray.parse($float_array);
		source.floatArray = floatArray;
		var $technique_common = el.querySelector("technique_common");
		var techniqueCommon = DAETechniqueCommon.parse($technique_common);
		source.techniqueCommon = techniqueCommon;
		return source;
	}

	static parseArray(el: Element, selector: string): Array<DAESource> {
		return DAEUtil.parseArray<DAESource>(this.parse, el, selector);
	}

	toVector3Array(): Array<Tea.Vector3> {
		var floatArray = this.floatArray;
		if (floatArray == null) {
			return null;
		}
		return floatArray.toVector3Array();
	}
}
