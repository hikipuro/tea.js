import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_lights
export class DAELight {
	static readonly TagName: string = "light";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAELight {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELight();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAELight> {
		return DAEUtil.parseArray<DAELight>(
			this.parse, parent, DAELight.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAELight.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXML(el, this.techniqueCommon);
		DAEUtil.addXMLArray(el, this.techniques);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
