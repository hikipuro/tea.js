import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEBoolArray } from "./DAEBoolArray";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAEIDREFArray } from "./DAEIDREFArray";
import { DAEIntArray } from "./DAEIntArray";
import { DAENameArray } from "./DAENameArray";
import { DAESIDREFArray } from "./DAESIDREFArray";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";

// parent:
// core: animation, mesh, morph, skin, spline
export class DAESource {
	id: string;
	name?: string;
	boolArray?: DAEBoolArray;
	floatArray?: DAEFloatArray;
	IDREFArray?: DAEIDREFArray;
	intArray?: DAEIntArray;
	NameArray?: DAENameArray;
	SIDREFArray?: DAESIDREFArray;
	//tokenArray?: any;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;

	constructor() {
		this.id = "";
		this.name = null;
		this.boolArray = null;
		this.floatArray = null;
		this.IDREFArray = null;
		this.intArray = null;
		this.NameArray = null;
		this.SIDREFArray = null;
		this.techniqueCommon = null;
		this.techniques = null;
	}

	static parse(el: Element): DAESource {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESource();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.boolArray = DAEBoolArray.parse(
			el.querySelector(":scope > bool_array")
		);
		value.floatArray = DAEFloatArray.parse(
			el.querySelector(":scope > float_array")
		);
		value.IDREFArray = DAEIDREFArray.parse(
			el.querySelector(":scope > IDREF_array")
		);
		value.intArray = DAEIntArray.parse(
			el.querySelector(":scope > int_array")
		);
		value.NameArray = DAENameArray.parse(
			el.querySelector(":scope > Name_array")
		);
		value.SIDREFArray = DAESIDREFArray.parse(
			el.querySelector(":scope > SIDREF_array")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
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
