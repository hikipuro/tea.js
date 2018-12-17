import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECone {
	static readonly TagName: string = "cone";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECone {
		if (el == null) {
			return null;
		}
		var value = new DAECone();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECone.TagName);
		return el;
	}
}
