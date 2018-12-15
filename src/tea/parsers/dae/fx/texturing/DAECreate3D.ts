import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECreate3D {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECreate3D {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECreate3D();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECreate3D.TagName);
		return el;
	}
}
