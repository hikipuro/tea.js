import { DAEColor } from "./DAEColor";

export class DAEAmbient {
	color: DAEColor;

	constructor() {
		this.color = null;
	}

	static parse(el: Element): DAEAmbient {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var ambient = new DAEAmbient();
		var $color = el.querySelector("color");
		ambient.color = DAEColor.parse($color);
		return ambient;
	}
}
