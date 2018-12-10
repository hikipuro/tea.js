export class DaeParam {
	name: string;
	type: string;

	constructor() {
		this.name = "";
		this.type = "";
	}

	static parse(el: Element): DaeParam {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var param = new DaeParam();
		param.name = el.getAttribute("name");
		param.type = el.getAttribute("type");
		return param;
	}
}
