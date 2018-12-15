import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEParabola {
	static readonly TagName: string = "parabola";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEParabola {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEParabola();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEParabola.TagName);
		return el;
	}
}
