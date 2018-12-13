import { DAEUtil } from "../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node
export class DAEInstanceNode {
	sid?: string;
	name?: string;
	url: string;
	proxy?: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.proxy = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceNode {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceNode();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.proxy = DAEUtil.stringAttrib(el, "proxy");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceNode> {
		return DAEUtil.parseArray<DAEInstanceNode>(
			this.parse, parent, "instance_node"
		);
	}
}
