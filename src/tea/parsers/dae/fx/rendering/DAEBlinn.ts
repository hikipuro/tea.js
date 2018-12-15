import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBlinn {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBlinn {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBlinn();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBlinn.TagName);
		return el;
	}
}
