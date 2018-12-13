export class DAETristrips {

	constructor() {
	}

	static parse(el: Element): DAETristrips {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETristrips();
		return value;
	}
}
