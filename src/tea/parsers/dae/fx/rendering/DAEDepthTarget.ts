import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEDepthTarget {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEDepthTarget {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEDepthTarget();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDepthTarget.TagName);
		return el;
	}
}
