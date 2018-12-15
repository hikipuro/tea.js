import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEArgument {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEArgument {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEArgument();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEArgument.TagName);
		return el;
	}
}
