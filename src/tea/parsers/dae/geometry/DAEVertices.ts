import { DAEUtil } from "../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAESemantic } from "../data/DAESemantic";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh, brep
export class DAEVertices {
	id: string;
	name?: string;
	inputs: Array<DAEInput>;
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
		value.inputs = DAEInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	findInput(semantic: DAESemantic): DAEInput {
		var inputs = this.inputs;
		if (inputs == null || inputs.length <= 0) {
			return null;
		}
		return inputs.find((input: DAEInput): boolean => {
			return input.semantic === semantic;
		});
	}
}
