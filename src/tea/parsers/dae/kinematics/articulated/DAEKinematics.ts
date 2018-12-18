import { DAEUtil } from "../../DAEUtil";
import { DAEInstanceKinematicsModel } from "../models/DAEInstanceKinematicsModel";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// TODO: add axis_info etc.

// parent: articulated_system
export class DAEKinematics {
	static readonly TagName: string = "kinematics";
	instanceKinematicsModels: Array<DAEInstanceKinematicsModel>;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instanceKinematicsModels = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEKinematics {
		if (el == null) {
			return null;
		}
		var value = new DAEKinematics();
		value.instanceKinematicsModels = DAEInstanceKinematicsModel.parseArray(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEKinematics.TagName);
		DAEUtil.addElementArray(el, this.instanceKinematicsModels);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
