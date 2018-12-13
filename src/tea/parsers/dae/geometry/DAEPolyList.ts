export class DAEPolyList {

	constructor() {
	}

	static parse(el: Element): DAEPolyList {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEPolyList();
		return value;
	}
}
