import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceMaterial {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceMaterial();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceMaterial.TagName);
		return el;
	}
}
