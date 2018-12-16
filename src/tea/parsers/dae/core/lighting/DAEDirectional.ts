import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "./DAEColor";

// parent: light/technique_common
export class DAEDirectional {
	static readonly TagName: string = "directional";
	color: DAEColor;

	constructor() {
		this.color = null;
	}

	static parse(el: Element): DAEDirectional {
		if (el == null) {
			return null;
		}
		var value = new DAEDirectional();
		value.color = DAEColor.parse(
			DAEUtil.queryChildSelector(el, DAEColor.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDirectional.TagName);
		DAEUtil.addElement(el, this.color);
		return el;
	}
}
