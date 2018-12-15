import { DAEUtil } from "../../DAEUtil";
import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: skin
export class DAEJoints {
	static readonly TagName: string = "joints";
	inputs: Array<DAEUnsharedInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = [];
		this.extras = null;
	}

	static parse(el: Element): DAEJoints {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEJoints();
		value.inputs = DAEUnsharedInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEJoints.TagName);
		DAEUtil.addXMLArray(el, this.inputs);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
