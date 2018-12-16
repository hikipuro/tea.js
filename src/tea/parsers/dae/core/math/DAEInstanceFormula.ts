import { DAEUtil } from "../../DAEUtil";
import { DAESetparam } from "../parameters/DAESetParam";

// parent: animation_clip, kinematics/axis_info, kinematics_model/technique_common
export class DAEInstanceFormula {
	static readonly TagName: string = "instance_formula";
	sid?: string;
	name?: string;
	url: string;
	setparams?: Array<DAESetparam>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.setparams = null;
	}

	static parse(el: Element): DAEInstanceFormula {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceFormula();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.setparams = DAESetparam.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceFormula> {
		return DAEUtil.parseArray<DAEInstanceFormula>(
			this.parse, parent, DAEInstanceFormula.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceFormula.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.setparams);
		return el;
	}
}
