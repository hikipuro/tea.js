import { DAEUtil } from "../../DAEUtil";
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
			el.querySelector(":scope > asset")
		);
		value.lights = DAELight.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("library_lights");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.lights);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
