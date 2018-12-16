import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryMaterials {
	static readonly TagName: string = "library_materials";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryMaterials {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryMaterials();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryMaterials.TagName);
		return el;
	}
}
