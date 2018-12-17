import { DAEUtil } from "../../DAEUtil";
import { DAERotate } from "../../core/transform/DAERotate";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAEAttachmentFull } from "./DAEAttachmentFull";
import { DAEAttachmentStart } from "./DAEAttachmentStart";
import { DAEAttachmentEnd } from "./DAEAttachmentEnd";

// parent: kinematics_model/technique_common, attachment_full
export class DAELink {
	static readonly TagName: string = "link";
	sid?: string;
	name?: string;
	rotates?: Array<DAERotate>;
	translates?: Array<DAETranslate>;
	attachmentFulls?: Array<DAEAttachmentFull>;
	attachmentStarts?: Array<DAEAttachmentStart>;
	attachmentEnds?: Array<DAEAttachmentEnd>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.rotates = null;
		this.translates = null;
		this.attachmentFulls = null;
		this.attachmentStarts = null;
		this.attachmentEnds = null;
	}

	static parse(el: Element): DAELink {
		if (el == null) {
			return null;
		}
		var value = new DAELink();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.rotates = DAERotate.parseArray(el);
		value.translates = DAETranslate.parseArray(el);
		value.attachmentFulls = DAEAttachmentFull.parseArray(el);
		value.attachmentStarts = DAEAttachmentStart.parseArray(el);
		value.attachmentEnds = DAEAttachmentEnd.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELink.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElementArray(el, this.rotates);
		DAEUtil.addElementArray(el, this.translates);
		DAEUtil.addElementArray(el, this.attachmentFulls);
		DAEUtil.addElementArray(el, this.attachmentStarts);
		DAEUtil.addElementArray(el, this.attachmentEnds);
		return el;
	}
}
