import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryEffects {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryEffects {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryEffects();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryEffects.TagName);
		return el;
	}
}
