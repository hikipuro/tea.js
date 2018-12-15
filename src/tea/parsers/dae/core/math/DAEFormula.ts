import { DAEUtil } from "../../DAEUtil";
import { DAENewparam } from "../parameters/DAENewparam";
import { DAETarget } from "../controller/DAETarget";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";

// parent: library_formulas, animation_clip,
// kinematics_model/technique_common, kinematics/axis_info
export class DAEFormula {
	static readonly TagName: string = "formula";
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
			DAEUtil.queryChildSelector(el, DAETarget.TagName)
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEFormula> {
		return DAEUtil.parseArray<DAEFormula>(
			this.parse, parent, DAEFormula.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEFormula.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.addXMLArray(el, this.newparams);
		DAEUtil.addXML(el, this.target);
		DAEUtil.addXML(el, this.techniqueCommon);
		DAEUtil.addXMLArray(el, this.techniques);
		return el;
	}
}
