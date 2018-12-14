import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node
export class DAEInstanceCamera {
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

	static parse(el: Element): DAEInstanceCamera {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceCamera();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceCamera> {
		return DAEUtil.parseArray<DAEInstanceCamera>(
			this.parse, parent, "instance_camera"
		);
	}
}
