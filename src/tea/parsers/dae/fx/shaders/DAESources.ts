import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESources {
	static readonly TagName: string = "sources";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESources {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESources();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESources.TagName);
		return el;
	}
}
