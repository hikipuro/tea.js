import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEllipse {
	static readonly TagName: string = "ellipse";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEllipse {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEEllipse();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEllipse.TagName);
		return el;
	}
}
