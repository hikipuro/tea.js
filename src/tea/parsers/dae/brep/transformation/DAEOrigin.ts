import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEOrigin {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEOrigin {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEOrigin();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEOrigin.TagName);
		return el;
	}
}
