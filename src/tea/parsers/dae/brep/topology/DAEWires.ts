import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEWires {
	static readonly TagName: string = "wires";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEWires {
		if (el == null) {
			return null;
		}
		var value = new DAEWires();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEWires.TagName);
		return el;
	}
}
