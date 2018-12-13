import { DAEUtil } from "../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node, shape
export class DAEInstanceGeometry {
	sid?: string;
	name?: string;
	url: string;
	//bindMaterial: any;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceGeometry {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEInstanceGeometry();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
