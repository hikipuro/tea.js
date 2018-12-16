import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEUtil } from "../../DAEUtil";

// paernt: morph
export class DAETargets {
	static readonly TagName: string = "targets";
	inputs: Array<DAEUnsharedInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAETargets {
		if (el == null) {
			return null;
		}
		var value = new DAETargets();
		value.inputs = DAEUnsharedInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETargets.TagName);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
