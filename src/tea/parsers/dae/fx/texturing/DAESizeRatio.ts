import { DAEUtil } from "../../DAEUtil";

// parent: create_2d
export class DAESizeRatio {
	static readonly TagName: string = "size_ratio";
	width: number;
	height: number;

	constructor() {
		this.width = null;
		this.height = null;
	}

	static parse(el: Element): DAESizeRatio {
		if (el == null) {
			return null;
		}
		var value = new DAESizeRatio();
		value.width = DAEUtil.getFloatAttr(el, "width");
		value.height = DAEUtil.getFloatAttr(el, "height");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESizeRatio.TagName);
		DAEUtil.setAttr(el, "width", this.width);
		DAEUtil.setAttr(el, "height", this.height);
		return el;
	}
}
