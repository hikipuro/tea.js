import { DaeInput } from "./DaeInput";

export class DaeVertices {
	id: string;
	inputs: Array<DaeInput>;

	constructor() {
		this.id = "";
		this.inputs = [];
	}

	static parse(el: Element): DaeVertices {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var vertices = new DaeVertices();
		vertices.id = el.id;
		var $inputs = el.querySelectorAll("input");
		for (var i = 0; i < $inputs.length; i++) {
			var $input = $inputs[i];
			var input = DaeInput.parse($input);
			if (input == null) {
				continue;
			}
			vertices.inputs.push(input);
		}
		return vertices;
	}

	findInput(semantic: string): DaeInput {
		var inputs = this.inputs;
		if (inputs == null || inputs.length <= 0) {
			return null;
		}
		return inputs.find((input: DaeInput): boolean => {
			return input.semantic === semantic;
		});
	}
}
