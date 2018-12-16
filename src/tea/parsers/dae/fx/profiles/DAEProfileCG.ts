import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileCG {
	static readonly TagName: string = "profile_CG";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileCG {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileCG();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileCG.TagName);
		return el;
	}
}
