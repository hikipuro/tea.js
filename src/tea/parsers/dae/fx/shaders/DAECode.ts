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
			return null;
		}
		var value = new DAECode();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAECode> {
		return DAEUtil.parseArray<DAECode>(
			this.parse, parent, DAECode.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAECode.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
