import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "./DAEColor";

// parent: light/technique_common
export class DAEDirectional {
	color: DAEColor;

	constructor() {
		this.color = null;
	}

	static parse(el: Element): DAEDirectional {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEDirectional();
		value.color = DAEColor.parse(
			el.querySelector(":scope > color")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("directional");
		DAEUtil.addXML(el, this.color);
		return el;
	}
}
