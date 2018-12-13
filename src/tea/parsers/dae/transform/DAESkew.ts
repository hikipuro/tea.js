export class DAESkew {

	constructor() {
	}

	static parse(el: Element): DAESkew {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESkew();
		return value;
	}
}
