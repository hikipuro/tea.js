import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEAmbient } from "./DAEAmbient";
import { DAEDirectional } from "./DAEDirectional";
import { DAEPoint } from "./DAEPoint";
import { DAESpot } from "./DAESpot";
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
			return null;
		}
		var value = new DAELight();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName),
			[DAEAmbient, DAEDirectional, DAEPoint, DAESpot]
		);
		value.techniques = DAETechnique.parseArray(
			el, [DAEAmbient, DAEDirectional, DAEPoint, DAESpot]
		);
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
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
