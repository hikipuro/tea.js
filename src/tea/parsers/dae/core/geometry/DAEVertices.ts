import { DAEUtil } from "../../DAEUtil";
import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAESemanticType } from "../data/DAESemanticType";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh, brep
export class DAEVertices {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEVertices();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
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
		var el = document.createElement("vertices");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXMLArray(el, this.inputs);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
