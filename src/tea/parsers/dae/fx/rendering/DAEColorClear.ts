import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEColorClear {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEColorClear {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEColorClear();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColorClear.TagName);
		return el;
	}
}
