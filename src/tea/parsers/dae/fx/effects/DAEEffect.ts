import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEffect {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEffect {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEEffect();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEffect.TagName);
		return el;
	}
}
