import { DAEUtil } from "../../DAEUtil";
import { DAEUnsharedInput } from "../data/DAEUnsharedInput";

// parent: animation
export class DAESampler {
	static readonly TagName: string = "sampler";
	id?: string;
	preBehavior: string;
	postBehavior: string;
	inputs: Array<DAEUnsharedInput>;

	constructor() {
		this.id = null;
		this.preBehavior = null;
		this.postBehavior = null;
		this.inputs = null;
	}

	static parse(el: Element): DAESampler {
		if (el == null) {
			return null;
		}
		var value = new DAESampler();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.preBehavior = DAEUtil.getStringAttr(el, "pre_behavior");
		value.postBehavior = DAEUtil.getStringAttr(el, "post_behavior");
		value.inputs = DAEUnsharedInput.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESampler> {
		return DAEUtil.parseArray<DAESampler>(
			this.parse, parent, DAESampler.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESampler.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "pre_behavior", this.preBehavior);
		DAEUtil.setAttr(el, "post_behavior", this.postBehavior);
		DAEUtil.addElementArray(el, this.inputs);
		return el;
	}
}
