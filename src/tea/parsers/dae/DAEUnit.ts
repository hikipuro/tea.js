export class DAEUnit {
	name: string;
	meter: string;

	constructor() {
		this.name = "";
		this.meter = "";
	}

	static parse(el: Element): DAEUnit {
		if (el == null) {
			return null;
		}
		var unit = new DAEUnit();
		unit.name = el.getAttribute("name");
		unit.meter = el.getAttribute("meter");
		return unit;
	}
}
