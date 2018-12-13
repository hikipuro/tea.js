export class DAEPolygons {

	constructor() {
	}

	static parse(el: Element): DAEPolygons {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEPolygons();
		return value;
	}
}
