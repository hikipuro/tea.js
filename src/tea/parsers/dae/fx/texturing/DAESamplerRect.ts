import { DAEUtil } from "../../DAEUtil";
import { DAEInstanceImage } from "./DAEInstanceImage";
import { DAETexcoord } from "./DAETexcoord";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent:
// core: newparam, setparam
// fx: array
export class DAESamplerRect {
	static readonly TagName: string = "samplerRECT";
	instanceImage?: DAEInstanceImage;
	texcoord?: DAETexcoord;
	wrapS?: string;
	wrapT?: string;
	wrapP?: string;
	minfilter?: string;
	magfilter?: string;
	mipfilter?: string;
	borderColor?: Array<number>;
	mipMaxLevel: number;
	mipMinLevel: number;
	mipBias: number;
	maxAnisotropy: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.instanceImage = null;
		this.texcoord = null;
		this.wrapS = "WRAP";
		this.wrapT = "WRAP";
		this.wrapP = "WRAP";
		this.minfilter = "LINEAR";
		this.magfilter = "LINEAR";
		this.mipfilter = "LINEAR";
		this.borderColor = null;
		this.mipMaxLevel = 0;
		this.mipMinLevel = 0;
		this.mipBias = 0.0;
		this.maxAnisotropy = 1;
		this.extras = null;
	}

	static parse(el: Element): DAESamplerRect {
		if (el == null) {
			return null;
		}
		var value = new DAESamplerRect();
		value.instanceImage = DAEInstanceImage.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceImage.TagName)
		);
		value.texcoord = DAETexcoord.parse(
			DAEUtil.queryChildSelector(el, DAETexcoord.TagName)
		);
		value.wrapS = DAEUtil.getStringContent(el, "wrap_s", "WRAP");
		value.wrapT = DAEUtil.getStringContent(el, "wrap_t", "WRAP");
		value.wrapP = DAEUtil.getStringContent(el, "wrap_p", "WRAP");
		value.minfilter = DAEUtil.getStringContent(el, "minfilter", "LINEAR");
		value.magfilter = DAEUtil.getStringContent(el, "magfilter", "LINEAR");
		value.mipfilter = DAEUtil.getStringContent(el, "mipfilter", "LINEAR");
		value.borderColor = DAEUtil.getFloatArrayContent(el, "border_color");
		value.mipMaxLevel = DAEUtil.getIntContent(el, "mip_max_level", 0);
		value.mipMinLevel = DAEUtil.getIntContent(el, "mip_min_level", 0);
		value.mipBias = DAEUtil.getFloatContent(el, "mip_bias", 0.0);
		value.maxAnisotropy = DAEUtil.getIntContent(el, "max_anisotropy", 1);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerRect.TagName);
		DAEUtil.addElement(el, this.instanceImage);
		DAEUtil.addElement(el, this.texcoord);
		DAEUtil.addStringContent(el, "wrap_s", this.wrapS, "WRAP");
		DAEUtil.addStringContent(el, "wrap_t", this.wrapT, "WRAP");
		DAEUtil.addStringContent(el, "wrap_p", this.wrapP, "WRAP");
		DAEUtil.addStringContent(el, "minfilter", this.minfilter, "LINEAR");
		DAEUtil.addStringContent(el, "magfilter", this.magfilter, "LINEAR");
		DAEUtil.addStringContent(el, "mipfilter", this.mipfilter, "LINEAR");
		DAEUtil.addArrayContent(el, "border_color", this.borderColor);
		DAEUtil.addIntContent(el, "mip_max_level", this.mipMaxLevel, 0);
		DAEUtil.addIntContent(el, "mip_min_level", this.mipMinLevel, 0);
		DAEUtil.addFloatContent(el, "mip_bias", this.mipBias, 0.0);
		DAEUtil.addFloatContent(el, "max_anisotropy", this.maxAnisotropy, 1);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
