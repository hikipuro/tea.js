import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindMaterial {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindMaterial();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindMaterial.TagName);
		return el;
	}
}
