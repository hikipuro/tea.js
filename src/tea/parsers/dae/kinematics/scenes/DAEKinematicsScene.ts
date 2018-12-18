import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEInstanceKinematicsModel } from "../models/DAEInstanceKinematicsModel";
import { DAEInstanceArticulatedSystem } from "../articulated/DAEInstanceArticulatedSystem";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_kinematics_scenes
export class DAEKinematicsScene {
	static readonly TagName: string = "kinematics_scene";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	instanceKinematicsModels?: Array<DAEInstanceKinematicsModel>;
	instanceArticulatedSystems?: Array<DAEInstanceArticulatedSystem>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.instanceKinematicsModels = null;
		this.instanceArticulatedSystems = null;
		this.extras = null;
	}

	static parse(el: Element): DAEKinematicsScene {
		if (el == null) {
			return null;
		}
		var value = new DAEKinematicsScene();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.instanceKinematicsModels = DAEInstanceKinematicsModel.parseArray(el);
		value.instanceArticulatedSystems = DAEInstanceArticulatedSystem.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEKinematicsScene> {
		return DAEUtil.parseArray<DAEKinematicsScene>(
			this.parse, parent, DAEKinematicsScene.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematicsScene.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.instanceKinematicsModels);
		DAEUtil.addElementArray(el, this.instanceArticulatedSystems);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
