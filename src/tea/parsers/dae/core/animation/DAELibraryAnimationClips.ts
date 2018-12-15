import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEAnimationClip } from "./DAEAnimationClip";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryAnimationClips {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryAnimationClips();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.assets = DAEAsset.parseArray(el);
		value.animationClips = DAEAnimationClip.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("library_animation_clips");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXMLArray(el, this.assets);
		DAEUtil.addXMLArray(el, this.animationClips);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
