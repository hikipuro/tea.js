import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProgram {
	static readonly TagName: string = "program";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProgram {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProgram();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProgram.TagName);
		return el;
	}
}
