import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAENurbs {
	static readonly TagName: string = "nurbs";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAENurbs {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENurbs();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAENurbs.TagName);
		return el;
	}
}
