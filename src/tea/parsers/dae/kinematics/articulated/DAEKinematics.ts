import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEKinematics {
	static readonly TagName: string = "kinematics";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEKinematics {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEKinematics();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematics.TagName);
		return el;
	}
}
