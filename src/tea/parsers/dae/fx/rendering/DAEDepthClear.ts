import { DAEUtil } from "../../DAEUtil";

// parent: evaluate
export class DAEDepthClear {
	static readonly TagName: string = "depth_clear";
	index?: number;
	data: number;

	constructor() {
		this.index = 0;
		this.data = null;
	}

	static parse(el: Element): DAEDepthClear {
		if (el == null) {
			return null;
		}
		var value = new DAEDepthClear();
		value.index = DAEUtil.getIntAttr(el, "index", 0);
		value.data = DAEUtil.getFloatContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEDepthClear.TagName);
		DAEUtil.setAttr(el, "index", this.index);
		DAEUtil.setFloatContent(el, this.data);
		return el;
	}
}
