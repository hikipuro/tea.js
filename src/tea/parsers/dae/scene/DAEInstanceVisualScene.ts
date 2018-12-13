import { DAEUtil } from "../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: scene
export class DAEInstanceVisualScene {
	sid?: string;
	name?: string;
	url: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceVisualScene {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEInstanceVisualScene();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
