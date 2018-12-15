import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileGLES {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileGLES {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileGLES();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileGLES.TagName);
		return el;
	}
}
