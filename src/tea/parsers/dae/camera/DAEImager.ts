import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: camera
export class DAEImager {
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEImager {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEImager();
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}