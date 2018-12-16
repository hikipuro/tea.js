import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELink {
	static readonly TagName: string = "link";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELink {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELink();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELink.TagName);
		return el;
	}
}
