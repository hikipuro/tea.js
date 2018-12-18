import { DAEUtil } from "../../DAEUtil";

// parent: create_2d
export class DAESizeExact {
	static readonly TagName: string = "size_exact";
	width: number;
	height: number;

	constructor() {
		this.width = null;
		this.height = null;
	}

	static parse(el: Element): DAESizeExact {
		if (el == null) {
			return null;
		}
		var value = new DAESizeExact();
		value.width = DAEUtil.getFloatAttr(el, "width");
		value.height = DAEUtil.getFloatAttr(el, "height");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESizeExact.TagName);
		DAEUtil.setAttr(el, "width", this.width);
		DAEUtil.setAttr(el, "height", this.height);
		return el;
	}
}
