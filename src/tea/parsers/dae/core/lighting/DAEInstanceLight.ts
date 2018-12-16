import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node
export class DAEInstanceLight {
	static readonly TagName: string = "instance_light";
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

	static parse(el: Element): DAEInstanceLight {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceLight();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceLight> {
		return DAEUtil.parseArray<DAEInstanceLight>(
			this.parse, parent, DAEInstanceLight.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceLight.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
