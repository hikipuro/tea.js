import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPrismatic {
	static readonly TagName: string = "prismatic";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPrismatic {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPrismatic();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPrismatic.TagName);
		return el;
	}
}
