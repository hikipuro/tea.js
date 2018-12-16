import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEArrayElement } from "./DAEArrayElement";
import { DAEBoolArray } from "./DAEBoolArray";
import { DAEFloatArray } from "./DAEFloatArray";
import { DAEIDREFArray } from "./DAEIDREFArray";
import { DAEIntArray } from "./DAEIntArray";
import { DAENameArray } from "./DAENameArray";
import { DAESIDREFArray } from "./DAESIDREFArray";
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
		value.arrayElement = DAESource.parseArrayElement(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESource> {
		return DAEUtil.parseArray<DAESource>(
			this.parse, parent, DAESource.TagName
		);
	}

	protected static parseArrayElement(el: Element): DAEArrayElement {
		var element = DAEUtil.queryChildSelector(el, DAEBoolArray.TagName);
		if (element != null) {
			return DAEBoolArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEFloatArray.TagName);
		if (element != null) {
			return DAEFloatArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEIDREFArray.TagName);
		if (element != null) {
			return DAEIDREFArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAEIntArray.TagName);
		if (element != null) {
			return DAEIntArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAENameArray.TagName);
		if (element != null) {
			return DAENameArray.parse(element);
		}
		element = DAEUtil.queryChildSelector(el, DAESIDREFArray.TagName);
		if (element != null) {
			return DAESIDREFArray.parse(element);
		}
		//element = DAEUtil.queryChildSelector(el, DAETokenArray.TagName);
		//if (element != null) {
			//return DAETokenArray.parse(element);
		//}
		return null;
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
