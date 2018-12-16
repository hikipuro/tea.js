import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEAxisInfo {
	static readonly TagName: string = "axis_info";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEAxisInfo {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAxisInfo();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAxisInfo.TagName);
		return el;
	}
}
