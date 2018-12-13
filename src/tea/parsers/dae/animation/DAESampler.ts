import { DAEUtil } from "../DAEUtil";

export class DAESampler {

	constructor() {
	}

	static parse(el: Element): DAESampler {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESampler();
		return value;
	}

	static parseArray(parent: Element): Array<DAESampler> {
		return DAEUtil.parseArray<DAESampler>(
			this.parse, parent, "sampler"
		);
	}
}
