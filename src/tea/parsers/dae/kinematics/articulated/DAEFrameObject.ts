import { DAEUtil } from "../../DAEUtil";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAERotate } from "../../core/transform/DAERotate";

// parent: kinematics/technique_common
export class DAEFrameObject {
	static readonly TagName: string = "frame_object";
	link?: string;
	translates?: Array<DAETranslate>;
	rotates?: Array<DAERotate>;

	constructor() {
		this.link = null;
		this.translates = null;
		this.rotates = null;
	}

	static parse(el: Element): DAEFrameObject {
		if (el == null) {
			return null;
		}
		var value = new DAEFrameObject();
		value.link = DAEUtil.getStringAttr(el, "link");
		value.translates = DAETranslate.parseArray(el);
		value.rotates = DAETranslate.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameObject.TagName);
		DAEUtil.setAttr(el, "link", this.link);
		DAEUtil.addElementArray(el, this.translates);
		DAEUtil.addElementArray(el, this.rotates);
		return el;
	}
}
