import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESampler1D {
	static readonly TagName: string = "sampler1D";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESampler1D {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESampler1D();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESampler1D.TagName);
		return el;
	}
}
