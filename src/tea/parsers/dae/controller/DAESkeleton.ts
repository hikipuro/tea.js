import { DAEUtil } from "../DAEUtil";

export class DAESkeleton {

	constructor() {
	}

	static parse(el: Element): DAESkeleton {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESkeleton();
		return value;
	}

	static parseArray(parent: Element): Array<DAESkeleton> {
		return DAEUtil.parseArray<DAESkeleton>(
			this.parse, parent, "skeleton"
		);
	}
}
