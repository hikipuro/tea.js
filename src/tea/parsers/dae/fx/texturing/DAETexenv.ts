import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETexenv {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETexenv {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETexenv();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETexenv.TagName);
		return el;
	}
}
