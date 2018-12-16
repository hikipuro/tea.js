import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEKinematicsModel {
	static readonly TagName: string = "kinematics_model";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEKinematicsModel {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEKinematicsModel();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematicsModel.TagName);
		return el;
	}
}
