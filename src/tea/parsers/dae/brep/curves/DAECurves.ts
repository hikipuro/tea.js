import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECurves {
	static readonly TagName: string = "curves";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECurves {
		if (el == null) {
			return null;
		}
		var value = new DAECurves();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECurves.TagName);
		return el;
	}
}
