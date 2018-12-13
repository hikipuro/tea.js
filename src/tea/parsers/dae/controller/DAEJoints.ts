import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: skin
export class DAEJoints {
	inputs: Array<DAEInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = [];
		this.extras = null;
	}

	static parse(el: Element): DAEJoints {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEJoints();
		value.inputs = DAEInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
