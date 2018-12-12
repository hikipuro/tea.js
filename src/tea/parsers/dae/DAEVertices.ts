import { DAEInput } from "./DAEInput";

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
		var vertices = new DAEVertices();
		vertices.id = el.id;
		vertices.inputs = DAEInput.parseArray(el, "input");
		return vertices;
	}

	findInput(semantic: string): DAEInput {
		var inputs = this.inputs;
		if (inputs == null || inputs.length <= 0) {
			return null;
		}
		return inputs.find((input: DAEInput): boolean => {
			return input.semantic === semantic;
		});
	}
}
