export class DAESpline {

	constructor() {
	}

	static parse(el: Element): DAESpline {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESpline();
		return value;
	}
}
