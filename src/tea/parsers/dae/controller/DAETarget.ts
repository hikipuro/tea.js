export class DAETarget {

	constructor() {
	}

	static parse(el: Element): DAETarget {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETarget();
		return value;
	}
}
