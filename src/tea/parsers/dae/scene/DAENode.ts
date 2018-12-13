import { DAEUtil } from "../DAEUtil";

export class DAENode {

	constructor() {
	}

	static parse(el: Element): DAENode {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAENode();
		return value;
	}

	static parseArray(parent: Element): Array<DAENode> {
		return DAEUtil.parseArray<DAENode>(
			this.parse, parent, "node"
		);
	}
}
