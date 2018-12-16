import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEProfileGLES2 {
	static readonly TagName: string = "profile_GLES2";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEProfileGLES2 {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEProfileGLES2();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileGLES2.TagName);
		return el;
	}
}
