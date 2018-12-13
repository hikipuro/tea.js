export class DAESkin {

	constructor() {
	}

	static parse(el: Element): DAESkin {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESkin();
		return value;
	}
}
