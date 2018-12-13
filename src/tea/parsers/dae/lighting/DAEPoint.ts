export class DAEPoint {

	constructor() {
	}

	static parse(el: Element): DAEPoint {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEPoint();
		return value;
	}
}
