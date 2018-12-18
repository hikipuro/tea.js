import { DAEUtil } from "../../DAEUtil";
import { DAEProfile } from "./DAEProfile";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAETechniqueFX } from "../effects/DAETechniqueFX";
import { DAEShaderElement } from "../rendering/DAEShaderElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: effect
export class DAEProfileCOMMON implements DAEProfile {
	static readonly TagName: string = "profile_COMMON";
	id?: string;
	asset?: DAEAsset;
	newparams?: Array<DAENewparam>;
	techniques?: Array<DAETechniqueFX>;
	shaderElements: Array<DAEShaderElement>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.asset = null;
		this.newparams = null;
		this.techniques = null;
		this.shaderElements = null;
		this.extras = null;
	}

	static parse(el: Element): DAEProfileCOMMON {
		if (el == null) {
			return null;
		}
		var value = new DAEProfileCOMMON();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.newparams = DAENewparam.parseArray(el);
		value.techniques = DAETechniqueFX.parseArray(el);
		value.shaderElements = DAEShaderElement.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileCOMMON.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.newparams);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.shaderElements);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
