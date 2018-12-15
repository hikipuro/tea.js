import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEShells {
	static readonly TagName: string = "shells";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEShells {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEShells();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEShells.TagName);
		return el;
	}
}
