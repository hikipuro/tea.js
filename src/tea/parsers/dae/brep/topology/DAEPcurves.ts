import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPcurves {
	static readonly TagName: string = "pcurves";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPcurves {
		if (el == null) {
			return null;
		}
		var value = new DAEPcurves();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPcurves.TagName);
		return el;
	}
}
