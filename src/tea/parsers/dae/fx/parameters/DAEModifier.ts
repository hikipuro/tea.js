import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEModifier {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEModifier {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEModifier();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEModifier.TagName);
		return el;
	}
}
