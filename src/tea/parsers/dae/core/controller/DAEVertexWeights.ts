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
			//console.error("parse error");
			return null;
		}
		var value = new DAEVertexWeights();
		value.count = DAEUtil.intAttrib(el, "count");
		value.inputs = DAESharedInput.parseArray(el);
		value.vcount = DAEUtil.intArray(
			DAEUtil.queryChildSelector(el, "vcount")
		);
		value.v = DAEUtil.intArray(
			DAEUtil.queryChildSelector(el, "v")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
	
	toXML(): Element {
		var el = document.createElement(DAEVertexWeights.TagName);
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.addXMLArray(el, this.inputs);
		if (this.vcount != null) {
			var vcount = document.createElement("vcount");
			DAEUtil.setArrayContent(vcount, this.vcount);
			el.appendChild(vcount);
		}
		if (this.v != null) {
			var v = document.createElement("v");
			DAEUtil.setArrayContent(v, this.v);
			el.appendChild(v);
		}
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
