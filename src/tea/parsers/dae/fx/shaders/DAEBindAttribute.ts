import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindAttribute {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindAttribute {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindAttribute();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindAttribute.TagName);
		return el;
	}
}
