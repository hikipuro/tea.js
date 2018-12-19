import { DAEUtil } from "../../DAEUtil";
import { DAEParam } from "../../core/data/DAEParam";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEInstanceMaterial } from "./DAEInstanceMaterial";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: instance_geometry, instance_controller
export class DAEBindMaterial {
	static readonly TagName: string = "bind_material";
	params?: Array<DAEParam>;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.params = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEBindMaterial {
		if (el == null) {
			return null;
		}
		var value = new DAEBindMaterial();
		value.params = DAEParam.parseArray(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName),
			[DAEInstanceMaterial]
		);
		value.techniques = DAETechnique.parseArray(
			el, [DAEInstanceMaterial]
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindMaterial.TagName);
		DAEUtil.addElementArray(el, this.params);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
