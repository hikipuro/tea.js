import { DAEUtil } from "../../DAEUtil";

// parent: evaluate
export class DAEColorClear {
	static readonly TagName: string = "color_clear";
	index?: number;
	data?: Array<number>;

	constructor() {
		this.index = 0;
		this.data = null;
	}

	static parse(el: Element): DAEColorClear {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEColorClear();
		value.index = DAEUtil.getIntAttr(el, "index", 0);
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColorClear.TagName);
		return el;
	}
}
