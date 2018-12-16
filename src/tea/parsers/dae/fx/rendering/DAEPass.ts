import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPass {
	static readonly TagName: string = "pass";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPass {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPass();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPass.TagName);
		return el;
	}
}
