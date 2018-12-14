import { DAEUtil } from "../../DAEUtil";

// parent: texcombiner
export class DAEAlpha {
	operator?: string;
	scale?: string;
	arguments: Array<string>;

	constructor() {
		this.operator = null;
		this.scale = null;
		this.arguments = null;
	}

	static parse(el: Element): DAEAlpha {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAlpha();
		value.operator = DAEUtil.stringAttrib(el, "operator");
		value.scale = DAEUtil.stringAttrib(el, "scale");
		value.arguments = null;
		return value;
	}
}
