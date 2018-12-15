import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESamplerDepth {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESamplerDepth {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESamplerDepth();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerDepth.TagName);
		return el;
	}
}
