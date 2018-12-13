export class DAETranslate {

	constructor() {
	}

	static parse(el: Element): DAETranslate {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETranslate();
		return value;
	}
}
