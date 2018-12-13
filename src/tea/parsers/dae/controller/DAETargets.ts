export class DAETargets {

	constructor() {
	}

	static parse(el: Element): DAETargets {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETargets();
		return value;
	}
}
