import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceImage {
	static readonly TagName: string = "instance_image";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceImage {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceImage();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceImage.TagName);
		return el;
	}
}
