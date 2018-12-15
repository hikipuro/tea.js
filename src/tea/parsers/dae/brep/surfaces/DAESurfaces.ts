import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESurfaces {
	static readonly TagName: string = "surfaces";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESurfaces {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESurfaces();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESurfaces.TagName);
		return el;
	}
}
