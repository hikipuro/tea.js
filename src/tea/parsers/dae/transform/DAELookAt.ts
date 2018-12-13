export class DAELookAt {

	constructor() {
	}

	static parse(el: Element): DAELookAt {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAELookAt();
		return value;
	}
}
