import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node
export class DAEInstanceNode {
	static readonly TagName: string = "instance_node";
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
			this.parse, parent, DAEInstanceNode.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceNode.TagName);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		DAEUtil.setAttribute(el, "proxy", this.proxy);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
