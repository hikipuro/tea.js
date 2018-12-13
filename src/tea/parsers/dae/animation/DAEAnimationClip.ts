import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEInstanceAnimation } from "./DAEInstanceAnimation";
import { DAEInstanceFormula } from "../math/DAEInstanceFormula";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_animation_clips
export class DAEAnimationClip {
	id?: string;
	start?: number;
	end?: number;
	name?: string;
	asset?: DAEAsset;
	instanceAnimations: Array<DAEInstanceAnimation>;
	instanceFormulas: Array<DAEInstanceFormula>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.start = null;
		this.end = null;
		this.name = null;
		this.asset = null;
		this.instanceAnimations = null;
		this.instanceFormulas = null;
		this.extras = null;
	}

	static parse(el: Element): DAEAnimationClip {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAnimationClip();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.start = DAEUtil.floatAttrib(el, "start", 0.0);
		value.end = DAEUtil.floatAttrib(el, "end");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.instanceAnimations = DAEInstanceAnimation.parseArray(el);
		value.instanceFormulas = DAEInstanceFormula.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAnimationClip> {
		return DAEUtil.parseArray<DAEAnimationClip>(
			this.parse, parent, "animation_clip"
		);
	}
}
