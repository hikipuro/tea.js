import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEInstanceAnimation } from "./DAEInstanceAnimation";
import { DAEInstanceFormula } from "../math/DAEInstanceFormula";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_animation_clips
export class DAEAnimationClip {
	static readonly TagName: string = "animation_clip";
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
			return null;
		}
		var value = new DAEAnimationClip();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.start = DAEUtil.getFloatAttr(el, "start", 0.0);
		value.end = DAEUtil.getFloatAttr(el, "end");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.instanceAnimations = DAEInstanceAnimation.parseArray(el);
		value.instanceFormulas = DAEInstanceFormula.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAnimationClip> {
		return DAEUtil.parseArray<DAEAnimationClip>(
			this.parse, parent, DAEAnimationClip.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAnimationClip.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "start", this.start, 0.0);
		DAEUtil.setAttr(el, "end", this.end);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.instanceAnimations);
		DAEUtil.addElementArray(el, this.instanceFormulas);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
