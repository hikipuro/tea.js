export class DAEOptics {

	constructor() {
	}

	static parse(el: Element): DAEOptics {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEOptics();
		return value;
	}
}
