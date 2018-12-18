import { DAEUtil } from "../../DAEUtil";

// parent: evaluate
export class DAEDraw {
	static readonly TagName: string = "draw";
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEDraw {
		if (el == null) {
			return null;
		}
		var value = new DAEDraw();
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDraw.TagName);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
