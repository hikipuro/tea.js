import { DAEUtil } from "../../DAEUtil";
import { DAEJointType } from "./DAEJointType";

// TODO: fix

// parent: joint
export class DAEPrismatic implements DAEJointType {
	static readonly TagName: string = "prismatic";
	sid?: string;
	//axis: 
	//limits:

	constructor() {
		this.sid = null;
	}

	static parse(el: Element): DAEPrismatic {
		if (el == null) {
			return null;
		}
		var value = new DAEPrismatic();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPrismatic.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		return el;
	}
}
