import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEDepthClear {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEDepthClear {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEDepthClear();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDepthClear.TagName);
		return el;
	}
}
