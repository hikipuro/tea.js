import * as Tea from "../../Tea";
import { DaeInput } from "./DaeInput";

export class DaeTriangles {
	id: string;
	material: string;
	count: number;
	inputs: Array<DaeInput>;
	data: Array<number>;

	constructor() {
		this.id = "";
		this.material = "";
		this.count = 0;
		this.inputs = [];
		this.data = [];
	}

	static parse(el: Element): DaeTriangles {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var triangles = new DaeTriangles();
		triangles.id = el.id;
		triangles.material = el.getAttribute("material");
		triangles.count = parseInt(el.getAttribute("count"));
		var $inputs = el.querySelectorAll("input");
		for (var i = 0; i < $inputs.length; i++) {
			var $input = $inputs[i];
			var input = DaeInput.parse($input);
			if (input == null) {
				continue;
			}
			triangles.inputs.push(input);
		}
		var $p = el.querySelector("p");
		var content = $p.textContent;
		var numbers = content.split(/\s/);
		for (var i = 0; i < numbers.length; i++) {
			var n = parseInt(numbers[i]);
			triangles.data.push(n);
		}
		return triangles;
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

	toVector3Array(start: number, count: number, stride: number = 1): Array<Tea.Vector3> {
		var data = this.data;
		if (data == null || data.length <= 0) {
			return null;
		}
		var array = [];
		var length = start + count * stride * 3;
		length = Math.min(length, data.length);
		for (var i = start; i < length; i += stride * 3) {
			var x = data[i];
			var y = data[i + stride];
			var z = data[i + stride * 2];
			var v = new Tea.Vector3(x, y, z);
			array.push(v);
		}
		return array;

	}
}
