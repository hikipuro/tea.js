import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryKinematicsModels {
	static readonly TagName: string = "library_kinematics_models";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryKinematicsModels {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryKinematicsModels();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryKinematicsModels.TagName);
		return el;
	}
}
