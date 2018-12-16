import { DAEUtil } from "../../DAEUtil";

// parent: binary
export class DAERef {
	static readonly TagName: string = "ref";
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAERef {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERef();
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERef.TagName);
		return el;
	}
}
