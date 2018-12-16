import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELambert {
	static readonly TagName: string = "lambert";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELambert {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELambert();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELambert.TagName);
		return el;
	}
}
