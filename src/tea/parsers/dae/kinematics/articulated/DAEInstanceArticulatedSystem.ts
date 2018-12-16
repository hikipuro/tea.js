import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceArticulatedSystem {
	static readonly TagName: string = "instance_articulated_system";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceArticulatedSystem {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceArticulatedSystem();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceArticulatedSystem.TagName);
		return el;
	}
}
