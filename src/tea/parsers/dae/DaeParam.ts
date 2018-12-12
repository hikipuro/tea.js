export class DAEParam {
	name: string;
	type: string;

	constructor() {
		this.name = "";
		this.type = "";
	}

	static parse(el: Element): DAEParam {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var param = new DAEParam();
		param.name = el.getAttribute("name");
		param.type = el.getAttribute("type");
		return param;
	}
}