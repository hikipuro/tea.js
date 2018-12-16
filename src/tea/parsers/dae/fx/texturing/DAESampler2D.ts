import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESampler2D {
	static readonly TagName: string = "sampler2D";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESampler2D {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESampler2D();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESampler2D.TagName);
		return el;
	}
}
