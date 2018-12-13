export class DAELines {

	constructor() {
	}

	static parse(el: Element): DAELines {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAELines();
		return value;
	}
}
