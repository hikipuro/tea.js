import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEKinematicsScene {
	static readonly TagName: string = "kinematics_scene";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEKinematicsScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEKinematicsScene();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematicsScene.TagName);
		return el;
	}
}
