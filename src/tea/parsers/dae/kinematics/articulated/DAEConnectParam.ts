import { DAEUtil } from "../../DAEUtil";

// parent: setparam
export class DAEConnectParam {
	static readonly TagName: string = "connect_param";
	ref: string;

	constructor() {
		this.ref = null;
	}

	static parse(el: Element): DAEConnectParam {
		if (el == null) {
			return null;
		}
		var value = new DAEConnectParam();
		value.ref = DAEUtil.getStringAttr(el, "ref");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConnectParam.TagName);
		return el;
	}
}
