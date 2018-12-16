import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAERevolute {
	static readonly TagName: string = "revolute";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAERevolute {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERevolute();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERevolute.TagName);
		return el;
	}
}
