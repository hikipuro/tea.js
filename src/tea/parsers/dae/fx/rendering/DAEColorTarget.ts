import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEColorTarget {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEColorTarget {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEColorTarget();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColorTarget.TagName);
		return el;
	}
}
