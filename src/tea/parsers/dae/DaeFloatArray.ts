import * as Tea from "../../Tea";

export class DaeFloatArray {
	id: string;
	data: Array<number>;
	count: number;

	constructor() {
		this.id = "";
		this.data = [];
	}

	static parse(el: Element): DaeFloatArray {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var floatArray = new DaeFloatArray();
		floatArray.id = el.id;
		floatArray.count = parseInt(el.getAttribute("count"));
		var content = el.textContent;
		var numbers = content.split(/\s/);
		for (var i = 0; i < numbers.length; i++) {
			var n = parseFloat(numbers[i]);
			floatArray.data.push(n);
		}
		return floatArray;
	}

	toVector3Array(): Array<Tea.Vector3> {
		var data = this.data;
		if (data == null || data.length <= 0) {
			return null;
		}
		var array = [];
		var length = data.length;
		for (var i = 0; i < length; i += 3) {
			var x = data[i];
			var y = data[i + 1];
			var z = data[i + 2];
			var v = new Tea.Vector3(x, y, z);
			array.push(v);
		}
		return array;
	}
}
