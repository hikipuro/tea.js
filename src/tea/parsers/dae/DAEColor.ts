import { DAEUtil } from "./DAEUtil";

export class DAEColor {
	data: Array<number>;

	constructor() {
		this.data = [];
	}

	static parse(el: Element): DAEColor {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var color = new DAEColor();
		color.data = DAEUtil.floatArray(el);
		return color;
	}
}
