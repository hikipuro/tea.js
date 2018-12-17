import { DAEUtil } from "../../DAEUtil";

// parent: newparam
export class DAEModifier {
	static readonly TagName: string = "modifier";
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEModifier {
		if (el == null) {
			return null;
		}
		var value = new DAEModifier();
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEModifier.TagName);
		return el;
	}
}
