import { DAEUtil } from "../../DAEUtil";

// parent: image
export class DAERenderable {
	static readonly TagName: string = "renderable";
	share: boolean;

	constructor() {
		this.share = null;
	}

	static parse(el: Element): DAERenderable {
		if (el == null) {
			return null;
		}
		var value = new DAERenderable();
		value.share = DAEUtil.getBoolAttr(el, "share");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAERenderable.TagName);
		DAEUtil.setAttr(el, "share", this.share);
		return el;
	}
}
