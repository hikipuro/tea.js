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
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceFormula();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
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
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		DAEUtil.addXMLArray(el, this.setparams);
		return el;
	}
}
