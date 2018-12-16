import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEArticulatedSystem {
	static readonly TagName: string = "articulated_system";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEArticulatedSystem {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEArticulatedSystem();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEArticulatedSystem.TagName);
		return el;
	}
}
