import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEArray {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEArray();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEArray.TagName);
		return el;
	}
}
