import { DAEUtil } from "../../DAEUtil";

// TODO: fix parse(), toXML()

// parent:
// core: instance_formula
export class DAESetparam {
	static readonly TagName: string = "setparam";
	ref: string;
	data: any;

	constructor() {
		this.ref = "";
		this.data = null;
	}

	static parse(el: Element): DAESetparam {
		if (el == null) {
			return null;
		}
		var value = new DAESetparam();
		value.ref = DAEUtil.getStringAttr(el, "ref");
		value.data = DAEUtil.getFloatContent(el, "float");
		if (value.data == null) {
			value.data = DAEUtil.getIntContent(el, "int");
		}
		if (value.data == null) {
			value.data = DAEUtil.getBoolContent(el, "bool");
		}
		if (value.data == null) {
			value.data = DAEUtil.getStringContent(el, "SIDREF");
		}
		return value;
	}

	static parseArray(parent: Element): Array<DAESetparam> {
		return DAEUtil.parseArray<DAESetparam>(
			this.parse, parent, DAESetparam.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESetparam.TagName);
		DAEUtil.setAttr(el, "ref", this.ref);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
