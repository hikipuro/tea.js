import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEConnectParam {
	static readonly TagName: string = "connect_param";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEConnectParam {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEConnectParam();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConnectParam.TagName);
		return el;
	}
}
