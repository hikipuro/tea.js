import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFormat {
	static readonly TagName: string = "format";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFormat {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFormat();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFormat.TagName);
		return el;
	}
}
