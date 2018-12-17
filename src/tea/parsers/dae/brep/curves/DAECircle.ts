import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECircle {
	static readonly TagName: string = "circle";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECircle {
		if (el == null) {
			return null;
		}
		var value = new DAECircle();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECircle.TagName);
		return el;
	}
}
