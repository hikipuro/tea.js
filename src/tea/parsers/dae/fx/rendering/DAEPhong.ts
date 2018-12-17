import { DAEUtil } from "../../DAEUtil";
import { DAEShaderElement } from "./DAEShaderElement";

// parent: technique (FX) (profile_COMMON)
export class DAEPhong implements DAEShaderElement {
	static readonly TagName: string = "phong";
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

	static parse(el: Element): DAEPhong {
		if (el == null) {
			return null;
		}
		var value = new DAEPhong();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPhong.TagName);
		return el;
	}
}
