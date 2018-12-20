import { DAEUtil } from "../../DAEUtil";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEParam } from "../data/DAEParam";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: camera
export class DAEImager {
	static readonly TagName: string = "imager";
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEImager {
		if (el == null) {
			return null;
		}
		var value = new DAEImager();
		value.techniques = DAETechnique.parseArray(
			el, [DAEParam]
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEImager.TagName);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
