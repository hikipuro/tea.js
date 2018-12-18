import { DAEUtil } from "../../DAEUtil";
import { DAEJointType } from "./DAEJointType";

// TODO: fix

// parent: joint
export class DAERevolute implements DAEJointType {
	static readonly TagName: string = "revolute";
	sid?: string;
	//axis: 
	//limits:

	constructor() {
		this.sid = null;
	}

	static parse(el: Element): DAERevolute {
		if (el == null) {
			return null;
		}
		var value = new DAERevolute();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERevolute.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		return el;
	}
}
