import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELine {
	static readonly TagName: string = "line";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELine {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELine();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELine.TagName);
		return el;
	}
}
