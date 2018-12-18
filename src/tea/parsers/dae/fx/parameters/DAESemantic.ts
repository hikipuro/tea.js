import { DAEUtil } from "../../DAEUtil";

// parent: newparam
export class DAESemantic {
	static readonly TagName: string = "semantic";
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAESemantic {
		if (el == null) {
			return null;
		}
		var value = new DAESemantic();
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESemantic.TagName);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
