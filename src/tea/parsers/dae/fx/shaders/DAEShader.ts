import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEShader {
	static readonly TagName: string = "shader";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEShader {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEShader();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEShader.TagName);
		return el;
	}
}
