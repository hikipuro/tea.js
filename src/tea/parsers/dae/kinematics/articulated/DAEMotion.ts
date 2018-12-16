import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEMotion {
	static readonly TagName: string = "motion";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEMotion {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEMotion();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEMotion.TagName);
		return el;
	}
}
