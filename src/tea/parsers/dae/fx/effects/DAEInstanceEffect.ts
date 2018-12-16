import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceEffect {
	static readonly TagName: string = "instance_effect";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceEffect {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceEffect();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceEffect.TagName);
		return el;
	}
}
