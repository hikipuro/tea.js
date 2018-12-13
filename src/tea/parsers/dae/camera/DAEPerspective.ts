export class DAEPerspective {

	constructor() {
	}

	static parse(el: Element): DAEPerspective {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEPerspective();
		return value;
	}
}
