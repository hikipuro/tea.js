import { DAEUtil } from "../../DAEUtil";
import { DAEShaderElement } from "./DAEShaderElement";
import { DAEEmission } from "./DAEEmission";
import { DAEReflective } from "./DAEReflective";
import { DAEReflectivity } from "./DAEReflectivity";
import { DAETransparent } from "./DAETransparent";
import { DAETransparency } from "./DAETransparency";
import { DAEIndexOfRefraction } from "./DAEIndexOfRefraction";

// parent: technique (FX) (profile_COMMON)
export class DAEConstant implements DAEShaderElement {
	static readonly TagName: string = "constant";
	emission?: DAEEmission;
	reflective?: DAEReflective;
	reflectivity?: DAEReflectivity;
	transparent?: DAETransparent;
	transparency?: DAETransparency;
	indexOfRefraction: DAEIndexOfRefraction;

	constructor() {
		this.emission = null;
		this.reflective = null;
		this.reflectivity = null;
		this.transparent = null;
		this.transparency = null;
		this.indexOfRefraction = null;
	}

	static parse(el: Element): DAEConstant {
		if (el == null) {
			return null;
		}
		var value = new DAEConstant();
		value.emission = DAEEmission.parse(
			DAEUtil.queryChildSelector(el, DAEEmission.TagName)
		);
		value.reflective = DAEReflective.parse(
			DAEUtil.queryChildSelector(el, DAEReflective.TagName)
		);
		value.reflectivity = DAEReflectivity.parse(
			DAEUtil.queryChildSelector(el, DAEReflectivity.TagName)
		);
		value.transparent = DAETransparent.parse(
			DAEUtil.queryChildSelector(el, DAETransparent.TagName)
		);
		value.transparency = DAETransparency.parse(
			DAEUtil.queryChildSelector(el, DAETransparency.TagName)
		);
		value.indexOfRefraction = DAEIndexOfRefraction.parse(
			DAEUtil.queryChildSelector(el, DAEIndexOfRefraction.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConstant.TagName);
		DAEUtil.addElement(el, this.emission);
		DAEUtil.addElement(el, this.reflective);
		DAEUtil.addElement(el, this.reflectivity);
		DAEUtil.addElement(el, this.transparent);
		DAEUtil.addElement(el, this.transparency);
		DAEUtil.addElement(el, this.indexOfRefraction);
		return el;
	}
}
