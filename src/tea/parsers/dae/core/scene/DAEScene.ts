import { DAEInstanceVisualScene } from "./DAEInstanceVisualScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAEScene {
	//instancePhysicsScene: Array<any>;
	instanceVisualScene?: DAEInstanceVisualScene;
	//instanceKinematicsScene: any;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instanceVisualScene = null;
		this.extras = null;
	}

	static parse(el: Element): DAEScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEScene();
		value.instanceVisualScene = DAEInstanceVisualScene.parse(
			el.querySelector(":scope > instance_visual_scene")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
