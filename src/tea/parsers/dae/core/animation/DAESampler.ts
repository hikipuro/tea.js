import { DAEUtil } from "../../DAEUtil";
import { DAEInput } from "../data/DAEInput";

// parent: animation
export class DAESampler {
	id?: string;
	preBehavior: string;
	postBehavior: string;
	inputs: Array<DAEInput>;

	constructor() {
		this.id = null;
		this.preBehavior = null;
		this.postBehavior = null;
		this.inputs = null;
	}

	static parse(el: Element): DAESampler {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESampler();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.preBehavior = DAEUtil.stringAttrib(el, "pre_behavior");
		value.postBehavior = DAEUtil.stringAttrib(el, "post_behavior");
		value.inputs = DAEInput.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESampler> {
		return DAEUtil.parseArray<DAESampler>(
			this.parse, parent, "sampler"
		);
	}
}
