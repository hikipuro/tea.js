import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEOrthographic } from "./DAEOrthographic";
import { DAEPerspective } from "./DAEPerspective";

// parent: camera
export class DAEOptics {
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;
	orthographic?: DAEOrthographic;
	perspective?: DAEPerspective;

	constructor() {
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
		this.orthographic = null;
		this.perspective = null;
	}

	static parse(el: Element): DAEOptics {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEOptics();
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		value.orthographic = DAEOrthographic.parse(
			el.querySelector(":scope > orthographic")
		);
		value.perspective = DAEPerspective.parse(
			el.querySelector(":scope > perspective")
		);
		return value;
	}
}
