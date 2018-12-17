import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: <sampler*>、color_target、depth_target、stencil_target
export class DAEInstanceImage {
	static readonly TagName: string = "instance_image";
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

	static parse(el: Element): DAEInstanceImage {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceImage();
		value.url = DAEUtil.getStringAttr(el, "url");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceImage.TagName);
		return el;
	}
}
