import { DAEUtil } from "../../DAEUtil";
import { DAENewparam } from "../parameters/DAENewparam";
import { DAETarget } from "../controller/DAETarget";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";

// parent: library_formulas, animation_clip,
// kinematics_model/technique_common, kinematics/axis_info
export class DAEFormula {
	id?: string;
	name?: string;
	sid?: string;
	newparams: Array<DAENewparam>;
	target: DAETarget;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;

	constructor() {
		this.id = null;
		this.name = null;
		this.sid = null;
		this.newparams = null;
		this.target = null;
		this.techniqueCommon = null;
		this.techniques = null;
	}

	static parse(el: Element): DAEFormula {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFormula();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.newparams = DAENewparam.parseArray(el);
		value.target = DAETarget.parse(
			el.querySelector(":scope > target")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEFormula> {
		return DAEUtil.parseArray<DAEFormula>(
			this.parse, parent, "formula"
		);
	}
}
