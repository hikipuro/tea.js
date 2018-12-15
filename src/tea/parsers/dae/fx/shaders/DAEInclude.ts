import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInclude {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInclude {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInclude();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInclude.TagName);
		return el;
	}
}
