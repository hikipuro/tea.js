export class DAENameArray {

	constructor() {
	}

	static parse(el: Element): DAENameArray {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAENameArray();
		return value;
	}
}
