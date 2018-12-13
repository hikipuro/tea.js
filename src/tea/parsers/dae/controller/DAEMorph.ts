export class DAEMorph {

	constructor() {
	}

	static parse(el: Element): DAEMorph {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEMorph();
		return value;
	}
}
