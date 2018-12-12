import { DAEUtil } from "./DAEUtil";

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

	toXML(): Element {
		var el = document.createElement("unit");
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "meter", this.meter);
		return el;
	}
}
