import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAERender {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAERender {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERender();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERender.TagName);
		return el;
	}
}
