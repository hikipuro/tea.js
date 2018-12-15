import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAENurbsSurface {
	static readonly TagName: string = "nurbs_surface";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAENurbsSurface {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENurbsSurface();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAENurbsSurface.TagName);
		return el;
	}
}
