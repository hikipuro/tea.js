import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindUniform {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindUniform {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindUniform();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindUniform.TagName);
		return el;
	}
}
