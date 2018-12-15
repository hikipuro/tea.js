import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEUtil } from "../../DAEUtil";

// paernt: morph
export class DAETargets {
	inputs: Array<DAEUnsharedInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAETargets {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETargets();
		value.inputs = DAEUnsharedInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("targets");
		DAEUtil.addXMLArray(el, this.inputs);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
