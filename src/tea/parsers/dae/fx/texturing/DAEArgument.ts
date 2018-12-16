import { DAEUtil } from "../../DAEUtil";

// parent: RGB, alpha
export class DAEArgument {
	static readonly TagName: string = "argument";
	source?: string;
	operand?: string;
	sampler?: string;

	constructor() {
		this.source = null;
		this.operand = null;
		this.sampler = null;
	}

	static parse(el: Element): DAEArgument {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEArgument();
		value.source = DAEUtil.getStringAttr(el, "source");
		value.operand = DAEUtil.getStringAttr(el, "source");
		value.sampler = DAEUtil.getStringAttr(el, "source");
		return value;
	}

	static parseArray(parent: Element): Array<DAEArgument> {
		return DAEUtil.parseArray<DAEArgument>(
			this.parse, parent, DAEArgument.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEArgument.TagName);
		return el;
	}
}
