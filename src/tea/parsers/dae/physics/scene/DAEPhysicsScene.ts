import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEInstanceForceField } from "./DAEInstanceForceField";
import { DAEInstancePhysicsModel } from "../model/DAEInstancePhysicsModel";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// TODO: add gravity, time_step

// parent: library_physics_scenes
export class DAEPhysicsScene {
	static readonly TagName: string = "physics_scene";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	instanceForceFields?: Array<DAEInstanceForceField>;
	instancePhysicsModels?: Array<DAEInstancePhysicsModel>;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.instanceForceFields = null;
		this.instancePhysicsModels = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPhysicsScene {
		if (el == null) {
			return null;
		}
		var value = new DAEPhysicsScene();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.instanceForceFields = DAEInstanceForceField.parseArray(el);
		value.instancePhysicsModels = DAEInstancePhysicsModel.parseArray(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsScene> {
		return DAEUtil.parseArray<DAEPhysicsScene>(
			this.parse, parent, DAEPhysicsScene.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsScene.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.instanceForceFields);
		DAEUtil.addElementArray(el, this.instancePhysicsModels);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
