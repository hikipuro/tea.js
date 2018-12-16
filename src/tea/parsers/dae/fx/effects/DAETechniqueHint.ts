import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETechniqueHint {
	static readonly TagName: string = "technique_hint";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETechniqueHint {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETechniqueHint();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueHint.TagName);
		return el;
	}
}
