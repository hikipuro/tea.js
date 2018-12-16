import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEAnimationClip } from "./DAEAnimationClip";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryAnimationClips {
	static readonly TagName: string = "library_animation_clips";
	id?: string;
	name?: string;
	assets?: Array<DAEAsset>;
	animationClips: Array<DAEAnimationClip>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.assets = null;
		this.animationClips = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryAnimationClips {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryAnimationClips();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.assets = DAEAsset.parseArray(el);
		value.animationClips = DAEAnimationClip.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryAnimationClips.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElementArray(el, this.assets);
		DAEUtil.addElementArray(el, this.animationClips);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
