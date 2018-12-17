import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAETechniqueFX } from "../effects/DAETechniqueFX";
import { DAEAnnotate } from "../effects/DAEAnnotate";
import { DAEPass } from "../rendering/DAEPass";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: effect
export class DAEProfileGLES {
	static readonly TagName: string = "profile_GLES";
	id?: string;
	platform?: string;
	asset?: DAEAsset;
	newparams?: Array<DAENewparam>;
	techniques?: Array<DAETechniqueFX>;
	annotates?: Array<DAEAnnotate>;
	passes?: Array<DAEPass>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.platform = null;
		this.asset = null;
		this.newparams = null;
		this.techniques = null;
		this.annotates = null;
		this.passes = null;
		this.extras = null;
	}

	static parse(el: Element): DAEProfileGLES {
		if (el == null) {
			return null;
		}
		var value = new DAEProfileGLES();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.platform = DAEUtil.getStringAttr(el, "platform");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.newparams = DAENewparam.parseArray(el);
		value.techniques = DAETechniqueFX.parseArray(el);
		value.annotates = DAEAnnotate.parseArray(el);
		value.passes = DAEPass.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileGLES.TagName);
		return el;
	}
}
