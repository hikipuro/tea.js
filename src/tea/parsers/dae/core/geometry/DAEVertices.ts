import { DAEUtil } from "../../DAEUtil";
import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAESemanticType } from "../data/DAESemanticType";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh, brep
export class DAEVertices {
	static readonly TagName: string = "vertices";
	id: string;
	name?: string;
	inputs: Array<DAEUnsharedInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = "";
		this.name = null;
		this.inputs = [];
		this.extras = null;
	}

	static parse(el: Element): DAEVertices {
		if (el == null) {
			return null;
		}
		var value = new DAEVertices();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.inputs = DAEUnsharedInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	findInput(semantic: DAESemanticType): DAEUnsharedInput {
		var inputs = this.inputs;
		if (inputs == null || inputs.length <= 0) {
			return null;
		}
		return inputs.find((input: DAEUnsharedInput): boolean => {
			return input.semantic === semantic;
		});
	}

	toXML(): Element {
		var el = document.createElement(DAEVertices.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
