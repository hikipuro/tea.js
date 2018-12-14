import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_lights
export class DAELight {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAELight {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELight();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAELight> {
		return DAEUtil.parseArray<DAELight>(
			this.parse, parent, "light"
		);
	}
}
