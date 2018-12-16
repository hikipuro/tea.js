import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEffectorInfo {
	static readonly TagName: string = "effector_info";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEffectorInfo {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEEffectorInfo();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEffectorInfo.TagName);
		return el;
	}
}
