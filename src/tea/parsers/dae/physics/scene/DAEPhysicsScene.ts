import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEInstanceForceField } from "./DAEInstanceForceField";
import { DAEInstancePhysicsModel } from "../model/DAEInstancePhysicsModel";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_physics_scenes
export class DAEPhysicsScene {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhysicsScene();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.instanceForceFields = DAEInstanceForceField.parseArray(el);
		value.instancePhysicsModels = DAEInstancePhysicsModel.parseArray(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector("technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsScene> {
		return DAEUtil.parseArray<DAEPhysicsScene>(
			this.parse, parent, "physics_scene"
		);
	}
}
