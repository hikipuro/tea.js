import { DAEUtil } from "../../DAEUtil";

// parent: instance_material (geometry)
export class DAEBindVertexInput {
	static readonly TagName: string = "bind_vertex_input";
	semantic: string;
	inputSemantic: string;
	inputSet: number;

	constructor() {
		this.semantic = null;
		this.inputSemantic = null;
		this.inputSet = null;
	}

	static parse(el: Element): DAEBindVertexInput {
		if (el == null) {
			return null;
		}
		var value = new DAEBindVertexInput();
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		value.inputSemantic = DAEUtil.getStringAttr(el, "input_semantic");
		value.inputSet = DAEUtil.getIntAttr(el, "input_set");
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindVertexInput> {
		return DAEUtil.parseArray<DAEBindVertexInput>(
			this.parse, parent, DAEBindVertexInput.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindVertexInput.TagName);
		return el;
	}
}
