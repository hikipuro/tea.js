import { DAEUtil } from "../../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: skin
export class DAEVertexWeights {
	count: number;
	inputs?: Array<DAEInput>;
	vcount?: Array<number>;
	v?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.count = 0;
		this.inputs = null;
		this.vcount = null;
		this.v = null;
		this.extras = null;
	}

	static parse(el: Element): DAEVertexWeights {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEVertexWeights();
		value.count = DAEUtil.intAttrib(el, "count");
		value.inputs = DAEInput.parseArray(el);
		value.vcount = DAEUtil.intArray(
			el.querySelector(":scope > vcount")
		);
		value.v = DAEUtil.intArray(
			el.querySelector(":scope > v")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
