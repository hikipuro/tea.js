import { DAEUtil } from "../../DAEUtil";

// parent: profile_CG, profile_GLSL, profile_GLES2
export class DAECode {
	static readonly TagName: string = "code";
	sid?: string;
	data: string;

	constructor() {
		this.sid = null;
		this.data = null;
	}

	static parse(el: Element): DAECode {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECode();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECode.TagName);
		return el;
	}
}
