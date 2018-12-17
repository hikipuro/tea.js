import { DAEUtil } from "../../DAEUtil";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAERotate } from "../../core/transform/DAERotate";

// parent: kinematics/technique_common
export class DAEFrameOrigin {
	static readonly TagName: string = "frame_origin";
	link?: string;
	translates?: Array<DAETranslate>;
	rotates?: Array<DAERotate>;

	constructor() {
		this.link = null;
		this.translates = null;
		this.rotates = null;
	}

	static parse(el: Element): DAEFrameOrigin {
		if (el == null) {
			return null;
		}
		var value = new DAEFrameOrigin();
		value.link = DAEUtil.getStringAttr(el, "link");
		value.translates = DAETranslate.parseArray(el);
		value.rotates = DAETranslate.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameOrigin.TagName);
		return el;
	}
}
