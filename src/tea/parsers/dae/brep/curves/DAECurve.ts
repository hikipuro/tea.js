import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECurve {
	static readonly TagName: string = "curve";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECurve {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECurve();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECurve.TagName);
		return el;
	}
}
