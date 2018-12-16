import { DAEUtil } from "../../DAEUtil";

export class DAEUnit {
	static readonly TagName: string = "unit";
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
		var el = document.createElement(DAEUnit.TagName);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "meter", this.meter);
		return el;
	}
}
