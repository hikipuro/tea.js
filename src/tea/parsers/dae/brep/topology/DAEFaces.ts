import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFaces {
	static readonly TagName: string = "faces";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFaces {
		if (el == null) {
			return null;
		}
		var value = new DAEFaces();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFaces.TagName);
		return el;
	}
}
