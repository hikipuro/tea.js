import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindKinematicsModel {
	static readonly TagName: string = "bind_kinematics_model";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindKinematicsModel {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindKinematicsModel();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindKinematicsModel.TagName);
		return el;
	}
}
