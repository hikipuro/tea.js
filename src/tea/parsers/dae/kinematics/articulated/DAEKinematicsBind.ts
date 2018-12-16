import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEKinematicsBind {
	static readonly TagName: string = "bind";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEKinematicsBind {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEKinematicsBind();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematicsBind.TagName);
		return el;
	}
}
