export class DAEMatrix {

	constructor() {
	}

	static parse(el: Element): DAEMatrix {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEMatrix();
		return value;
	}
}
