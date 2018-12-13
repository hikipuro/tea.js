export class DAEScene {

	constructor() {
	}

	static parse(el: Element): DAEScene {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEScene();
		return value;
	}
}
