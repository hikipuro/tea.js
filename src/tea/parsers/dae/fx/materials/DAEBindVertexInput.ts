import { DAEUtil } from "../../DAEUtil";
import { DAEParam } from "../../core/data/DAEParam";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: instance_material (geometry)
export class DAEBindVertexInput {
	static readonly TagName: string = "bind_vertex_input";
	semantic: string;
	inputSemantic: string;
	inputSet?: string;

	constructor() {
		this.semantic = null;
		this.inputSemantic = null;
		this.inputSet = null;
	}

	static parse(el: Element): DAEBindVertexInput {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindVertexInput();
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		value.inputSemantic = DAEUtil.getStringAttr(el, "input_semantic");
		value.inputSet = DAEUtil.getStringAttr(el, "input_set");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindVertexInput.TagName);
		return el;
	}
}
