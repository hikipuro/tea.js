import { DAEUtil } from "../../DAEUtil";

export class DAEAltitude {
	static readonly TagName: string = "altitude";
	mode: string;
	value: number;

	constructor() {
		this.mode = null;
		this.value = null;
	}

	static parse(el: Element): DAEAltitude {
		if (el == null) {
			return null;
		}
		var value = new DAEAltitude();
		value.mode = DAEUtil.getStringAttr(el, "mode");
		value.value = DAEUtil.getFloatContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAltitude.TagName);
		DAEUtil.setStringContent(el, this.value.toString());
		return el;
	}
}
