import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceKinematicsModel {
	static readonly TagName: string = "instance_kinematics_model";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceKinematicsModel {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceKinematicsModel();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceKinematicsModel.TagName);
		return el;
	}
}
