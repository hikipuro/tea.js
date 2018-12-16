import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceJoint {
	static readonly TagName: string = "instance_joint";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceJoint {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceJoint();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceJoint.TagName);
		return el;
	}
}
