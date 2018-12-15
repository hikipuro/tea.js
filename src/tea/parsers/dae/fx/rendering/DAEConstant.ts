import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEConstant {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEConstant {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEConstant();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConstant.TagName);
		return el;
	}
}
