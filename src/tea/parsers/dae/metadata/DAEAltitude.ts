import { DAEUtil } from "../DAEUtil";

export class DAEAltitude {
	mode: string;
	value: number;

	constructor() {
		this.mode = null;
		this.value = null;
	}

	static parse(el: Element): DAEAltitude {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEAltitude();
		value.mode = el.getAttribute("mode");
		value.value = DAEUtil.floatContent(el);
		return value;
	}
}
