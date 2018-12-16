import { DAEUtil } from "../../DAEUtil";
import { DAEInstancePhysicsScene } from "../../physics/scene/DAEInstancePhysicsScene";
import { DAEInstanceVisualScene } from "./DAEInstanceVisualScene";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEInstanceKinematicsScene } from "../../kinematics/scenes/DAEInstanceKinematicsScene";

// parent: COLLADA
export class DAEScene {
	static readonly TagName: string = "scene";
	instancePhysicsScenes?: Array<DAEInstancePhysicsScene>;
	instanceVisualScene?: DAEInstanceVisualScene;
	instanceKinematicsScene: DAEInstanceKinematicsScene;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instancePhysicsScenes = null;
		this.instanceVisualScene = null;
		this.instanceKinematicsScene = null;
		this.extras = null;
	}

	static parse(el: Element): DAEScene {
		if (el == null) {
			return null;
		}
		var value = new DAEScene();
		value.instancePhysicsScenes = DAEInstancePhysicsScene.parseArray(el);
		value.instanceVisualScene = DAEInstanceVisualScene.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceVisualScene.TagName)
		);
		value.instanceKinematicsScene = DAEInstanceKinematicsScene.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceKinematicsScene.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEScene.TagName);
		DAEUtil.addElementArray(el, this.instancePhysicsScenes);
		DAEUtil.addElement(el, this.instanceVisualScene);
		DAEUtil.addElement(el, this.instanceKinematicsScene);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
