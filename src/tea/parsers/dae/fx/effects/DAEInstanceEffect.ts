import { DAEUtil } from "../../DAEUtil";
import { DAETechniqueHint } from "./DAETechniqueHint";
import { DAESetparam } from "../../core/parameters/DAESetParam";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: material
export class DAEInstanceEffect {
	static readonly TagName: string = "instance_effect";
	sid?: string;
	name?: string;
	url: string;
	techniqueHints?: Array<DAETechniqueHint>;
	setparams?: Array<DAESetparam>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = null;
		this.techniqueHints = null;
		this.setparams = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceEffect {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceEffect();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.techniqueHints = DAETechniqueHint.parseArray(el);
		value.setparams = DAESetparam.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceEffect.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.techniqueHints);
		DAEUtil.addElementArray(el, this.setparams);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
