import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESurface {
	static readonly TagName: string = "surface";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESurface {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESurface();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESurface.TagName);
		return el;
	}
}
