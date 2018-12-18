import { DAEUtil } from "../../DAEUtil";
import { DAEShaderElement } from "./DAEShaderElement";
import { DAEEmission } from "./DAEEmission";
import { DAEAmbientFX } from "./DAEAmbientFX";
import { DAEDiffuse } from "./DAEDiffuse";
import { DAESpecular } from "./DAESpecular";
import { DAEShininess } from "./DAEShininess";
import { DAEReflective } from "./DAEReflective";
import { DAEReflectivity } from "./DAEReflectivity";
import { DAETransparent } from "./DAETransparent";
import { DAETransparency } from "./DAETransparency";
import { DAEIndexOfRefraction } from "./DAEIndexOfRefraction";

// parent: technique (FX) (profile_COMMON)
export class DAEBlinn implements DAEShaderElement {
	static readonly TagName: string = "blinn";
	emission?: DAEEmission;
	ambient?: DAEAmbientFX;
	diffuse?: DAEDiffuse;
	specular?: DAESpecular;
	shininess?: DAEShininess;
	reflective?: DAEReflective;
	reflectivity?: DAEReflectivity;
	transparent?: DAETransparent;
	transparency?: DAETransparency;
	indexOfRefraction: DAEIndexOfRefraction;

	constructor() {
		this.emission = null;
		this.ambient = null;
		this.diffuse = null;
		this.specular = null;
		this.shininess = null;
		this.reflective = null;
		this.reflectivity = null;
		this.transparent = null;
		this.transparency = null;
		this.indexOfRefraction = null;
	}

	static parse(el: Element): DAEBlinn {
		if (el == null) {
			return null;
		}
		var value = new DAEBlinn();
		value.emission = DAEEmission.parse(
			DAEUtil.queryChildSelector(el, DAEEmission.TagName)
		);
		value.ambient = DAEAmbientFX.parse(
			DAEUtil.queryChildSelector(el, DAEAmbientFX.TagName)
		);
		value.diffuse = DAEDiffuse.parse(
			DAEUtil.queryChildSelector(el, DAEDiffuse.TagName)
		);
		value.specular = DAESpecular.parse(
			DAEUtil.queryChildSelector(el, DAESpecular.TagName)
		);
		value.shininess = DAEShininess.parse(
			DAEUtil.queryChildSelector(el, DAEShininess.TagName)
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
		var el = document.createElement(DAEBlinn.TagName);
		DAEUtil.addElement(el, this.emission);
		DAEUtil.addElement(el, this.ambient);
		DAEUtil.addElement(el, this.diffuse);
		DAEUtil.addElement(el, this.specular);
		DAEUtil.addElement(el, this.shininess);
		DAEUtil.addElement(el, this.reflective);
		DAEUtil.addElement(el, this.reflectivity);
		DAEUtil.addElement(el, this.transparent);
		DAEUtil.addElement(el, this.transparency);
		DAEUtil.addElement(el, this.indexOfRefraction);
		return el;
	}
}
