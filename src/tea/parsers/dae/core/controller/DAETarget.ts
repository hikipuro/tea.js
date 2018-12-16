// TODO: fix
export class DAETarget {
	static readonly TagName: string = "target";

	constructor() {
	}

	static parse(el: Element): DAETarget {
		if (el == null) {
			return null;
		}
		var value = new DAETarget();
		return value;
	}
}
