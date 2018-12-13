import { DAEColor } from "./DAEColor";

// parent: light/technique_common
export class DAEAmbient {
	color: DAEColor;

	constructor() {
		this.color = null;
	}

	static parse(el: Element): DAEAmbient {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAmbient();
		value.color = DAEColor.parse(
			el.querySelector("color")
		);
		return value;
	}
}
