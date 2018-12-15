import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAERGB {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAERGB {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERGB();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERGB.TagName);
		return el;
	}
}
