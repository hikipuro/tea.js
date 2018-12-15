import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInitFrom {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInitFrom {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInitFrom();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInitFrom.TagName);
		return el;
	}
}
