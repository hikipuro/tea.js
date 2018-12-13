export class DAESpot {

	constructor() {
	}

	static parse(el: Element): DAESpot {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESpot();
		return value;
	}
}
