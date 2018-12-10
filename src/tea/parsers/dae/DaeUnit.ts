export class DaeUnit {
	name: string;
	meter: string;

	constructor() {
		this.name = "";
		this.meter = "";
	}

	static parse(el: Element): DaeUnit {
		if (el == null) {
			return null;
		}
		var unit = new DaeUnit();
		unit.name = el.getAttribute("name");
		unit.meter = el.getAttribute("meter");
		return unit;
	}
}
