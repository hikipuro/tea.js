import { DAEUtil } from "../../DAEUtil";

// parent: geometry
export class DAEBrep {
	static readonly TagName: string = "brep";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBrep {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBrep();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBrep.TagName);
		return el;
	}
}
