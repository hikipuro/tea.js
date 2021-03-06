import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: animation_clip
export class DAEInstanceAnimation {
	static readonly TagName: string = "instance_animation";
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
			return null;
		}
		var value = new DAEInstanceAnimation();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceAnimation> {
		return DAEUtil.parseArray<DAEInstanceAnimation>(
			this.parse, parent, DAEInstanceAnimation.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceAnimation.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
