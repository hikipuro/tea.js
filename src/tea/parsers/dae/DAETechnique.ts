export class DAETechnique {
	id?: string;
	sid: string;

	constructor() {
		this.id = null;
		this.sid = null;
	}

	static parse(el: Element): DAETechnique {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var technique = new DAETechnique();
		technique.id = el.id;
		technique.sid = el.getAttribute("sid");
		return technique;
	}
}
