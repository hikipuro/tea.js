import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAELight } from "./DAELight";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryLights {
	static readonly TagName: string = "library_lights";
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
			return null;
		}
		var value = new DAELibraryLights();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.lights = DAELight.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryLights.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.lights);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
