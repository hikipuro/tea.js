import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEHyperbola {
	static readonly TagName: string = "hyperbola";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEHyperbola {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEHyperbola();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEHyperbola.TagName);
		return el;
	}
}
