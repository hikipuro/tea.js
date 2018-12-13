export class DAERotate {

	constructor() {
	}

	static parse(el: Element): DAERotate {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAERotate();
		return value;
	}
}
