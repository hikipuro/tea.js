import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileCOMMON {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileCOMMON {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileCOMMON();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileCOMMON.TagName);
		return el;
	}
}
