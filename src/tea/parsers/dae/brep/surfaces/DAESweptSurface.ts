import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESweptSurface {
	static readonly TagName: string = "swept_surface";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESweptSurface {
		if (el == null) {
			return null;
		}
		var value = new DAESweptSurface();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESweptSurface.TagName);
		return el;
	}
}
