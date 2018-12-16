import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECreate2D {
	static readonly TagName: string = "create_2d";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECreate2D {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECreate2D();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECreate2D.TagName);
		return el;
	}
}
