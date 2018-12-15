import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPhong {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPhong {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhong();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPhong.TagName);
		return el;
	}
}
