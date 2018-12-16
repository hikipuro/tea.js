import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEDraw {
	static readonly TagName: string = "draw";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEDraw {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEDraw();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDraw.TagName);
		return el;
	}
}
