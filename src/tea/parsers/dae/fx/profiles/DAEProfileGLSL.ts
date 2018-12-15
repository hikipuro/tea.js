import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileGLSL {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileGLSL {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileGLSL();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileGLSL.TagName);
		return el;
	}
}
