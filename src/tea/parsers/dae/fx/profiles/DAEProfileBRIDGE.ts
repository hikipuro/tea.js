import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileBRIDGE {
	static readonly TagName: string = "profile_BRIDGE";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileBRIDGE {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileBRIDGE();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileBRIDGE.TagName);
		return el;
	}
}
