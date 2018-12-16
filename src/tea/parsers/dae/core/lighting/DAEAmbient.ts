import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "./DAEColor";

// parent: light/technique_common
export class DAEAmbient {
	static readonly TagName: string = "ambient";
	color: DAEColor;

	constructor() {
		this.color = null;
	}

	static parse(el: Element): DAEAmbient {
		if (el == null) {
			return null;
		}
		var value = new DAEAmbient();
		value.color = DAEColor.parse(
			DAEUtil.queryChildSelector(el, DAEColor.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAmbient.TagName);
		DAEUtil.addElement(el, this.color);
		return el;
	}
}
