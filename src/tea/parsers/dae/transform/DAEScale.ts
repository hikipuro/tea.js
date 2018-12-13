export class DAEScale {

	constructor() {
	}

	static parse(el: Element): DAEScale {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEScale();
		return value;
	}
}
