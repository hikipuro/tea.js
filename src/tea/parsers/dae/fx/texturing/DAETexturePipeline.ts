import { DAEUtil } from "../../DAEUtil";
import { DAETexcombiner } from "./DAETexcombiner";
import { DAETexenv } from "./DAETexenv";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: states
export class DAETexturePipeline {
	static readonly TagName: string = "texture_pipeline";
	sid?: string;
	texcombiners?: Array<DAETexcombiner>;
	texenvs?: Array<DAETexenv>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.texcombiners = null;
		this.texenvs = null;
		this.extras = null;
	}

	static parse(el: Element): DAETexturePipeline {
		if (el == null) {
			return null;
		}
		var value = new DAETexturePipeline();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.texcombiners = DAETexcombiner.parseArray(el);
		value.texenvs = DAETexenv.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETexturePipeline.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.addElementArray(el, this.texcombiners);
		DAEUtil.addElementArray(el, this.texenvs);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
