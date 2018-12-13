export class DAESIDREFArray {

	constructor() {
	}

	static parse(el: Element): DAESIDREFArray {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAESIDREFArray();
		return value;
	}
}
