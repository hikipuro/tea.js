import { DAEUtil } from "../../DAEUtil";

// parent: evaluate
export class DAEStencilClear {
	static readonly TagName: string = "stencil_clear";
	index?: number;

	constructor() {
		this.index = 0;
	}

	static parse(el: Element): DAEStencilClear {
		if (el == null) {
			return null;
		}
		var value = new DAEStencilClear();
		value.index = DAEUtil.getIntAttr(el, "index", 0);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStencilClear.TagName);
		DAEUtil.setAttr(el, "index", this.index);
		return el;
	}
}
