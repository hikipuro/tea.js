import { DAEUtil } from "../../DAEUtil";

// parent: instance_controller
export class DAESkeleton {
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAESkeleton {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESkeleton();
		value.data = DAEUtil.textContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESkeleton> {
		return DAEUtil.parseArray<DAESkeleton>(
			this.parse, parent, "skeleton"
		);
	}
}
