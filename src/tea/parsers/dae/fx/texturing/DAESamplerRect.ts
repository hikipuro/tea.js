import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESamplerRect {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESamplerRect {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESamplerRect();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerRect.TagName);
		return el;
	}
}
