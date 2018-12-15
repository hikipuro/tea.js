import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECode {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECode {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECode();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECode.TagName);
		return el;
	}
}
