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
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceLight();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
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
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
