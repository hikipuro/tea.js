import { DAEUtil } from "../../DAEUtil";
import { DAEProfile } from "./DAEProfile";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAECode } from "../shaders/DAECode";
import { DAEInclude } from "../shaders/DAEInclude";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAETechniqueFX } from "../effects/DAETechniqueFX";
import { DAEAnnotate } from "../effects/DAEAnnotate";
import { DAEPass } from "../rendering/DAEPass";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: effect
export class DAEProfileGLES2 implements DAEProfile {
	static readonly TagName: string = "profile_GLES2";
	id?: string;
	language: string;
	platforms?: Array<string>;
	asset?: DAEAsset;
	codes?: Array<DAECode>;
	includes?: Array<DAEInclude>;
	newparams?: Array<DAENewparam>;
	techniques?: Array<DAETechniqueFX>;
	annotates?: Array<DAEAnnotate>;
	passes?: Array<DAEPass>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.language = null;
		this.platforms = null;
		this.asset = null;
		this.codes = null;
		this.includes = null;
		this.newparams = null;
		this.techniques = null;
		this.annotates = null;
		this.passes = null;
		this.extras = null;
	}

	static parse(el: Element): DAEProfileGLES2 {
		if (el == null) {
			return null;
		}
		var value = new DAEProfileGLES2();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.language = DAEUtil.getStringAttr(el, "language");
		value.platforms = DAEUtil.getStringArrayAttr(el, "platforms");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.codes = DAECode.parseArray(el);
		value.includes = DAEInclude.parseArray(el);
		value.newparams = DAENewparam.parseArray(el);
		value.techniques = DAETechniqueFX.parseArray(el);
		value.annotates = DAEAnnotate.parseArray(el);
		value.passes = DAEPass.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileGLES2.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "language", this.language);
		DAEUtil.setAttr(el, "platforms", this.platforms.join(" "));
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.codes);
		DAEUtil.addElementArray(el, this.includes);
		DAEUtil.addElementArray(el, this.newparams);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.annotates);
		DAEUtil.addElementArray(el, this.passes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
