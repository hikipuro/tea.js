import { DAEUtil } from "../../DAEUtil";
import { DAEParam } from "../../core/data/DAEParam";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
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
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindMaterial.TagName);
		return el;
	}
}
