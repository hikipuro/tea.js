import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// paernt: morph
export class DAETargets {
	inputs: Array<DAEInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAETargets {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETargets();
		value.inputs = DAEInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
