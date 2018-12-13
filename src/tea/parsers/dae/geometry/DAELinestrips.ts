export class DAELinestrips {

	constructor() {
	}

	static parse(el: Element): DAELinestrips {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAELinestrips();
		return value;
	}
}
