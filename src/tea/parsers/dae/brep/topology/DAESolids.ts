import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESolids {
	static readonly TagName: string = "solids";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESolids {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESolids();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESolids.TagName);
		return el;
	}
}
