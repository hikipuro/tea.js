import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESamplerStates {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESamplerStates {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESamplerStates();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerStates.TagName);
		return el;
	}
}
