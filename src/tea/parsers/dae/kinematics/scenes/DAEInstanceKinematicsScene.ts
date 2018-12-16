import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEInstanceKinematicsScene {
	static readonly TagName: string = "instance_kinematics_scene";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEInstanceKinematicsScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceKinematicsScene();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceKinematicsScene.TagName);
		return el;
	}
}
