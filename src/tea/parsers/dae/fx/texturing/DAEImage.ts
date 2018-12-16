import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEImage {
	static readonly TagName: string = "image";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEImage {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEImage();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEImage.TagName);
		return el;
	}
}
