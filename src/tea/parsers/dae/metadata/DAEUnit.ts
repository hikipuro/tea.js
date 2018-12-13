import { DAEUtil } from "../DAEUtil";

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
		var value = new DAEUnit();
		value.name = el.getAttribute("name");
		value.meter = el.getAttribute("meter");
		return value;
	}

	toXML(): Element {
		var el = document.createElement("unit");
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "meter", this.meter);
		return el;
	}
}
