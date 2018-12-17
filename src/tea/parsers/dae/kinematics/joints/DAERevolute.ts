import { DAEUtil } from "../../DAEUtil";
import { DAEJointType } from "./DAEJointType";

// TODO: fix

// parent: joint
export class DAERevolute extends DAEJointType {
	static readonly TagName: string = "revolute";
	sid?: string;
	//axis: 
	//limits:

	constructor() {
		super();
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
		return el;
	}
}
