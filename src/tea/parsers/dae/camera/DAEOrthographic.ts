export class DAEOrthographic {

	constructor() {
	}

	static parse(el: Element): DAEOrthographic {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEOrthographic();
		return value;
	}
}
