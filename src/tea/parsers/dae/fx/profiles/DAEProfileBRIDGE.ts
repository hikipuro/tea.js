import { DAEUtil } from "../../DAEUtil";
import { DAEProfile } from "./DAEProfile";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: effect
export class DAEProfileBRIDGE implements DAEProfile {
	static readonly TagName: string = "profile_BRIDGE";
	id?: string;
	platform?: string;
	url: string;
	asset?: DAEAsset;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.platform = null;
		this.url = null;
		this.asset = null;
		this.extras = null;
	}

	static parse(el: Element): DAEProfileBRIDGE {
		if (el == null) {
			return null;
		}
		var value = new DAEProfileBRIDGE();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.platform = DAEUtil.getStringAttr(el, "platform");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProfileBRIDGE.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "platform", this.platform);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
