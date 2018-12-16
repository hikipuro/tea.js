import { DAEUtil } from "../../DAEUtil";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: skin
export class DAEVertexWeights {
	static readonly TagName: string = "vertex_weights";
	count: number;
	inputs?: Array<DAESharedInput>;
	vcount?: Array<number>;
	v?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.count = 0;
		this.inputs = null;
		this.vcount = null;
		this.v = null;
		this.extras = null;
	}

	static parse(el: Element): DAEVertexWeights {
		if (el == null) {
			return null;
		}
		var value = new DAEVertexWeights();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.inputs = DAESharedInput.parseArray(el);
		value.vcount = DAEUtil.getIntArrayContent(
			DAEUtil.queryChildSelector(el, "vcount")
		);
		value.v = DAEUtil.getIntArrayContent(
			DAEUtil.queryChildSelector(el, "v")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
	
	toXML(): Element {
		var el = document.createElement(DAEVertexWeights.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addArrayContent(el, "vcount", this.vcount);
		DAEUtil.addArrayContent(el, "v", this.v);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
