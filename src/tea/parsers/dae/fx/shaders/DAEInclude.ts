import { DAEUtil } from "../../DAEUtil";

// parent: profile_CG, profile_GLES2, profile_GLSL
export class DAEInclude {
	static readonly TagName: string = "include";
	sid: string;
	url: string;

	constructor() {
		this.sid = null;
		this.url = null;
	}

	static parse(el: Element): DAEInclude {
		if (el == null) {
			return null;
		}
		var value = new DAEInclude();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.url = DAEUtil.getStringAttr(el, "url");
		return value;
	}

	static parseArray(parent: Element): Array<DAEInclude> {
		return DAEUtil.parseArray<DAEInclude>(
			this.parse, parent, DAEInclude.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInclude.TagName);
		return el;
	}
}
