import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: animation_clip
export class DAEInstanceAnimation {
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

	static parse(el: Element): DAEInstanceAnimation {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceAnimation();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceAnimation> {
		return DAEUtil.parseArray<DAEInstanceAnimation>(
			this.parse, parent, "instance_animation"
		);
	}

	toXML(): Element {
		var el = document.createElement("instance_animation");
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
