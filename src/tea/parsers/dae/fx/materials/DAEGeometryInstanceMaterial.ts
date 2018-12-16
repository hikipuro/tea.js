import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEGeometryInstanceMaterial {
	static readonly TagName: string = "instance_material";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEGeometryInstanceMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEGeometryInstanceMaterial();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEGeometryInstanceMaterial.TagName);
		return el;
	}
}
