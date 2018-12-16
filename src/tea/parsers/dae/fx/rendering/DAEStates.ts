import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEStates {
	static readonly TagName: string = "states";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEStates {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEStates();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStates.TagName);
		return el;
	}
}
