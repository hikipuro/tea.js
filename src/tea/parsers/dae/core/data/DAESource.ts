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
			//console.error("parse error");
			return null;
		}
		var value = new DAESource();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.arrayElement = DAESource.parseArrayElement(el);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESource> {
		return DAEUtil.parseArray<DAESource>(
			this.parse, parent, "source"
		);
	}

	protected static parseArrayElement(el: Element): DAEArrayElement {
		var element = el.querySelector(":scope > bool_array");
		if (element != null) {
			return DAEBoolArray.parse(element);
		}
		element = el.querySelector(":scope > float_array");
		if (element != null) {
			return DAEFloatArray.parse(element);
		}
		element = el.querySelector(":scope > IDREF_array");
		if (element != null) {
			return DAEIDREFArray.parse(element);
		}
		element = el.querySelector(":scope > int_array");
		if (element != null) {
			return DAEIntArray.parse(element);
		}
		element = el.querySelector(":scope > Name_array");
		if (element != null) {
			return DAENameArray.parse(element);
		}
		element = el.querySelector(":scope > SIDREF_array");
		if (element != null) {
			return DAESIDREFArray.parse(element);
		}
		element = el.querySelector(":scope > token_array");
		if (element != null) {
			//return DAETokenArray.parse(element);
		}
		return null;
	}

	toXML(): Element {
		var el = document.createElement("source");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXML(el, this.arrayElement);
		DAEUtil.addXML(el, this.techniqueCommon);
		DAEUtil.addXMLArray(el, this.techniques);
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
