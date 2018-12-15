import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEvaluate {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEvaluate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEEvaluate();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEvaluate.TagName);
		return el;
	}
}
