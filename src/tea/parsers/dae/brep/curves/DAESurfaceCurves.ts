import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESurfaceCurves {
	static readonly TagName: string = "surface_curves";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESurfaceCurves {
		if (el == null) {
			return null;
		}
		var value = new DAESurfaceCurves();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESurfaceCurves.TagName);
		return el;
	}
}
