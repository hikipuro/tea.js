import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECompiler {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECompiler {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECompiler();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECompiler.TagName);
		return el;
	}
}
