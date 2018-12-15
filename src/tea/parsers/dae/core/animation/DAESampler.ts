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
			//console.error("parse error");
			return null;
		}
		var value = new DAESampler();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.preBehavior = DAEUtil.stringAttrib(el, "pre_behavior");
		value.postBehavior = DAEUtil.stringAttrib(el, "post_behavior");
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
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "pre_behavior", this.preBehavior);
		DAEUtil.setAttribute(el, "post_behavior", this.postBehavior);
		DAEUtil.addXMLArray(el, this.inputs);
		return el;
	}
}
