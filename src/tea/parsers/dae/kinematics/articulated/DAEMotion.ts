import { DAEUtil } from "../../DAEUtil";
import { DAEInstanceArticulatedSystem } from "./DAEInstanceArticulatedSystem";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// TODO: add axis_info etc.

// parent: articulated_system
export class DAEMotion {
	static readonly TagName: string = "motion";
	instanceArticulatedSystem: DAEInstanceArticulatedSystem;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instanceArticulatedSystem = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEMotion {
		if (el == null) {
			return null;
		}
		var value = new DAEMotion();
		value.instanceArticulatedSystem = DAEInstanceArticulatedSystem.parse(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEMotion.TagName);
		return el;
	}
}
