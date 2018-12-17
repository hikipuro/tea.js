import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEOrient {
	static readonly TagName: string = "orient";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEOrient {
		if (el == null) {
			return null;
		}
		var value = new DAEOrient();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEOrient.TagName);
		return el;
	}
}
