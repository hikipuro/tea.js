import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAELight } from "./DAELight";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryLights {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	lights: Array<DAELight>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.lights = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryLights {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryLights();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.lights = DAELight.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
