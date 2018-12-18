import { DAEUtil } from "../../DAEUtil";

// TODO: fix constant

// parent: texture_pipeline
export class DAETexenv {
	static readonly TagName: string = "texenv";
	operator?: string;
	sampler?: string;
	//constant?:

	constructor() {
		this.operator = null;
		this.sampler = null;
	}

	static parse(el: Element): DAETexenv {
		if (el == null) {
			return null;
		}
		var value = new DAETexenv();
		value.operator = DAEUtil.getStringAttr(el, "operator");
		value.sampler = DAEUtil.getStringAttr(el, "sampler");
		return value;
	}

	static parseArray(parent: Element): Array<DAETexenv> {
		return DAEUtil.parseArray<DAETexenv>(
			this.parse, parent, DAETexenv.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETexenv.TagName);
		DAEUtil.setAttr(el, "operator", this.operator);
		DAEUtil.setAttr(el, "sampler", this.sampler);
		return el;
	}
}
