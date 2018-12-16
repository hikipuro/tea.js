import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryJoints {
	static readonly TagName: string = "library_joints";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryJoints {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryJoints();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryJoints.TagName);
		return el;
	}
}
