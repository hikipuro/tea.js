import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEUsertype {
	static readonly TagName: string = "usertype";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEUsertype {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEUsertype();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEUsertype.TagName);
		return el;
	}
}
