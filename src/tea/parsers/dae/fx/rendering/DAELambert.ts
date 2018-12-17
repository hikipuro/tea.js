import { DAEUtil } from "../../DAEUtil";
import { DAEShaderElement } from "./DAEShaderElement";

// parent: technique (FX) (profile_COMMON)
export class DAELambert implements DAEShaderElement {
	static readonly TagName: string = "lambert";
	emission?: number;
	ambient?: number;
	diffuse?: number;
	reflective?: number;
	reflectivity?: number;
	transparent?: number;
	transparency?: number;
	indexOfRefraction: number;

	constructor() {
		this.emission = null;
		this.ambient = null;
		this.diffuse = null;
		this.reflective = null;
		this.reflectivity = null;
		this.transparent = null;
		this.transparency = null;
		this.indexOfRefraction = null;
	}

	static parse(el: Element): DAELambert {
		if (el == null) {
			return null;
		}
		var value = new DAELambert();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELambert.TagName);
		return el;
	}
}
