export class DAEVertexWeights {

	constructor() {
	}

	static parse(el: Element): DAEVertexWeights {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEVertexWeights();
		return value;
	}
}
