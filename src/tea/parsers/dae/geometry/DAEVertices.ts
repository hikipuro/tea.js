import { DAEInput } from "../data/DAEInput";
import { DAESemantic } from "../data/DAESemantic";
import { DAEUtil } from "../DAEUtil";

export class DAEVertices {
	id: string;
	inputs: Array<DAEInput>;

	constructor() {
		this.id = "";
		this.inputs = [];
	}

	static parse(el: Element): DAEVertices {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEVertices();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.inputs = DAEInput.parseArray(el);
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
