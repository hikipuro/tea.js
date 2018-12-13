import * as Tea from "../../../Tea";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAEUtil } from "../DAEUtil";

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
		var value = new DAESource();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.floatArray = DAEFloatArray.parse(
			el.querySelector("float_array")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector("technique_common")
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAESource> {
		return DAEUtil.parseArray<DAESource>(
			this.parse, parent, "source"
		);
	}

	toVector3Array(): Array<Tea.Vector3> {
		var floatArray = this.floatArray;
		if (floatArray == null) {
			return null;
		}
		return floatArray.toVector3Array();
	}
}
