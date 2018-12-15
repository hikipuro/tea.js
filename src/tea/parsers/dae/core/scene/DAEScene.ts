import { DAEUtil } from "../../DAEUtil";
import { DAEInstancePhysicsScene } from "../../physics/scene/DAEInstancePhysicsScene";
import { DAEInstanceVisualScene } from "./DAEInstanceVisualScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAEScene {
	static readonly TagName: string = "scene";
	instancePhysicsScenes?: Array<DAEInstancePhysicsScene>;
	instanceVisualScene?: DAEInstanceVisualScene;
	//instanceKinematicsScene: any;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instancePhysicsScenes = null;
		this.instanceVisualScene = null;
		this.extras = null;
	}

	static parse(el: Element): DAEScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEScene();
		value.instancePhysicsScenes = DAEInstancePhysicsScene.parseArray(el);
		value.instanceVisualScene = DAEInstanceVisualScene.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceVisualScene.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEScene.TagName);
		DAEUtil.addXMLArray(el, this.instancePhysicsScenes);
		DAEUtil.addXML(el, this.instanceVisualScene);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
