import { DAEUtil } from "../../DAEUtil";

// parent: create_3d, create_cube
export class DAESize {
	static readonly TagName: string = "size";
	width: number;
	height: number;
	depth: number;

	constructor() {
		this.width = null;
		this.height = null;
		this.depth = null;
	}

	static parse(el: Element): DAESize {
		if (el == null) {
			return null;
		}
		var value = new DAESize();
		value.width = DAEUtil.getFloatAttr(el, "width");
		value.height = DAEUtil.getFloatAttr(el, "height");
		value.depth = DAEUtil.getFloatAttr(el, "depth");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESize.TagName);
		DAEUtil.setAttr(el, "width", this.width);
		DAEUtil.setAttr(el, "height", this.height);
		DAEUtil.setAttr(el, "depth", this.depth);
		return el;
	}
}
