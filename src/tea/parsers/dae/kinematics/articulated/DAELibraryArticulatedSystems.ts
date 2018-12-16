import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryArticulatedSystems {
	static readonly TagName: string = "library_articulated_systems";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryArticulatedSystems {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryArticulatedSystems();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryArticulatedSystems.TagName);
		return el;
	}
}
