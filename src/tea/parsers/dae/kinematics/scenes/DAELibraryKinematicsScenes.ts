import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryKinematicsScenes {
	static readonly TagName: string = "library_kinematics_scenes";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryKinematicsScenes {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryKinematicsScenes();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryKinematicsScenes.TagName);
		return el;
	}
}
