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
			return null;
		}
		var value = new DAEArgument();
		value.source = DAEUtil.getStringAttr(el, "source");
		value.operand = DAEUtil.getStringAttr(el, "operand");
		value.sampler = DAEUtil.getStringAttr(el, "sampler");
		return value;
	}

	static parseArray(parent: Element): Array<DAEArgument> {
		return DAEUtil.parseArray<DAEArgument>(
			this.parse, parent, DAEArgument.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEArgument.TagName);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.setAttr(el, "operand", this.operand);
		DAEUtil.setAttr(el, "sampler", this.sampler);
		return el;
	}
}
