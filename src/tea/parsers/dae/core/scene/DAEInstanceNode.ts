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
			return null;
		}
		var value = new DAEInstanceNode();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.proxy = DAEUtil.getStringAttr(el, "proxy");
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
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.setAttr(el, "proxy", this.proxy);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
