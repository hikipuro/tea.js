import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEArrayElement } from "./DAEArrayElement";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";

// parent:
// core: animation, mesh, morph, skin, spline
export class DAESource {
	static readonly TagName: string = "source";
	id: string;
	name?: string;
	asset?: DAEAsset;
	arrayElement?: DAEArrayElement;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;

	constructor() {
		this.id = "";
		this.name = null;
		this.asset = null;
		this.arrayElement = null;
		this.techniqueCommon = null;
		this.techniques = null;
	}

	static parse(el: Element): DAESource {
		if (el == null) {
			return null;
		}
		var value = new DAESource();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.arrayElement = DAEArrayElement.parse(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName),
			[DAEAsset]
		);
		value.techniques = DAETechnique.parseArray(
			el, [DAEAsset]
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAESource> {
		return DAEUtil.parseArray<DAESource>(
			this.parse, parent, DAESource.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESource.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElement(el, this.arrayElement);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		return el;
	}

	toVector3Array(): Array<Tea.Vector3> {
		var floatArray = this.arrayElement as DAEFloatArray;
		if (floatArray == null) {
			return null;
		}
		return floatArray.toVector3Array();
	}
}
