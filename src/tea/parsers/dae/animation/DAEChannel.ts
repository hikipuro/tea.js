import { DAEUtil } from "../DAEUtil";

// parent: animation
export class DAEChannel {
	source: string;
	target: string;

	constructor() {
		this.source = "";
		this.target = "";
	}

	static parse(el: Element): DAEChannel {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEChannel();
		value.source = DAEUtil.stringAttrib(el, "source", "");
		value.target = DAEUtil.stringAttrib(el, "target", "");
		return value;
	}
	
	static parseArray(parent: Element): Array<DAEChannel> {
		return DAEUtil.parseArray<DAEChannel>(
			this.parse, parent, "channel"
		);
	}
}
