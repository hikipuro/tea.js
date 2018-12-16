import { DAEUtil } from "../../DAEUtil";

// TODO: fix

// parent: technique (FX) (profile_COMMON)
export class DAEConstant {
	static readonly TagName: string = "constant";
	emission?: number;
	reflective?: number;
	reflectivity?: number;
	transparent?: number;
	transparency?: number;
	indexOfRefraction: number;

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
			//console.error("parse error");
			return null;
		}
		var value = new DAEConstant();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConstant.TagName);
		return el;
	}
}
