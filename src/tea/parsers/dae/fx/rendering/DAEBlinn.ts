import { DAEUtil } from "../../DAEUtil";

// TODO: fix

// parent: technique (FX) (profile_COMMON)
export class DAEBlinn {
	static readonly TagName: string = "blinn";
	emission?: number;
	ambient?: number;
	diffuse?: number;
	specular?: number;
	shininess?: number;
	reflective?: number;
	reflectivity?: number;
	transparent?: number;
	transparency?: number;
	indexOfRefraction: number;

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
			//console.error("parse error");
			return null;
		}
		var value = new DAEBlinn();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBlinn.TagName);
		return el;
	}
}
