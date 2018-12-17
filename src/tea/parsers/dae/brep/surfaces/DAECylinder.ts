import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECylinder {
	static readonly TagName: string = "cylinder";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECylinder {
		if (el == null) {
			return null;
		}
		var value = new DAECylinder();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECylinder.TagName);
		return el;
	}
}
