import { DAEUtil } from "../../DAEUtil";
import { DAESetparam } from "../../core/parameters/DAESetParam";

// parent:
// core: newparam, setparam
// fx: array, bind_uniform
export class DAEUsertype {
	static readonly TagName: string = "usertype";
	typename: string;
	source?: string;
	setparams?: Array<DAESetparam>;

	constructor() {
		this.typename = null;
		this.source = null;
		this.setparams = null;
	}

	static parse(el: Element): DAEUsertype {
		if (el == null) {
			return null;
		}
		var value = new DAEUsertype();
		value.typename = DAEUtil.getStringAttr(el, "typename");
		value.source = DAEUtil.getStringAttr(el, "source");
		value.setparams = DAESetparam.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEUsertype.TagName);
		DAEUtil.setAttr(el, "typename", this.typename);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.addElementArray(el, this.setparams);
		return el;
	}
}
