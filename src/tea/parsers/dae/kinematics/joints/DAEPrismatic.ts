import { DAEUtil } from "../../DAEUtil";
import { DAEJointType } from "./DAEJointType";

// TODO: fix

// parent: joint
export class DAEPrismatic extends DAEJointType {
	static readonly TagName: string = "prismatic";
	sid?: string;
	//axis: 
	//limits:

	constructor() {
		super();
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
		return el;
	}
}
