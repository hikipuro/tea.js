import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: scene
export class DAEInstanceVisualScene {
	static readonly TagName: string = "instance_visual_scene";
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
			return null;
		}
		var value = new DAEInstanceVisualScene();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceVisualScene.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
