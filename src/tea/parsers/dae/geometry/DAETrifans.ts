export class DAETrifans {

	constructor() {
	}

	static parse(el: Element): DAETrifans {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAETrifans();
		return value;
	}
}
