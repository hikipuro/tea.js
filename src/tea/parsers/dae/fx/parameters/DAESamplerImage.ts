import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: <instance_effect>/<setparam>
export class DAESamplerImage {
	static readonly TagName: string = "sampler_image";
	url: string;
	sid?: string;
	name?: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.url = null;
		this.sid = null;
		this.name = null;
		this.extras = null;
	}

	static parse(el: Element): DAESamplerImage {
		if (el == null) {
			return null;
		}
		var value = new DAESamplerImage();
		value.url = DAEUtil.getStringAttr(el, "url");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerImage.TagName);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.instanceEffect);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
