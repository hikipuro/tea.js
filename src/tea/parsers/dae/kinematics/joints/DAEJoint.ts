import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEJoint {
	static readonly TagName: string = "joint";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEJoint {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEJoint();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEJoint.TagName);
		return el;
	}
}
