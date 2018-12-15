import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBinary {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBinary {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBinary();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBinary.TagName);
		return el;
	}
}
