import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEMaterial {
	static readonly TagName: string = "material";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEMaterial();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEMaterial.TagName);
		return el;
	}
}
