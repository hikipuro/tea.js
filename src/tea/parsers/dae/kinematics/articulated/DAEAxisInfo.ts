import { DAEUtil } from "../../DAEUtil";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAEFormula } from "../../core/math/DAEFormula";
import { DAEInstanceFormula } from "../../core/math/DAEInstanceFormula";

// TODO: fix

// parent: kinematics, motion
export class DAEAxisInfo {
	static readonly TagName: string = "axis_info";
	sid?: string;
	name?: string;
	axis: string;

	newparams?: Array<DAENewparam>;
	//active?: DAEActive;
	//locked?: 
	//indices?: Array<any>;
	//limits?: DAELimits;
	formulas?: Array<DAEFormula>;
	instanceFormulas?: Array<DAEInstanceFormula>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.axis = "";
		this.formulas = null;
		this.instanceFormulas = null;
	}

	static parse(el: Element): DAEAxisInfo {
		if (el == null) {
			return null;
		}
		var value = new DAEAxisInfo();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.axis = DAEUtil.getStringAttr(el, "axis", "");
		value.formulas = DAEFormula.parseArray(el);
		value.instanceFormulas = DAEInstanceFormula.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAxisInfo.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "axis", this.axis);
		DAEUtil.addElementArray(el, this.formulas);
		DAEUtil.addElementArray(el, this.instanceFormulas);
		return el;
	}
}
