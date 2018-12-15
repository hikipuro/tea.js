import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESamplerImage {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESamplerImage {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESamplerImage();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerImage.TagName);
		return el;
	}
}
