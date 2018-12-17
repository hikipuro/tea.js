import { DAEUtil } from "../../DAEUtil";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAERotate } from "../../core/transform/DAERotate";
import { DAELink } from "./DAELink";

// parent: link
export class DAEAttachmentFull {
	static readonly TagName: string = "attachment_full";
	joint: string;
	translates: Array<DAETranslate>;
	rotates: Array<DAERotate>;
	link: DAELink;

	constructor() {
		this.joint = null;
		this.translates = null;
		this.rotates = null;
		this.link = null;
	}

	static parse(el: Element): DAEAttachmentFull {
		if (el == null) {
			return null;
		}
		var value = new DAEAttachmentFull();
		value.joint = DAEUtil.getStringAttr(el, "joint");
		value.translates = DAETranslate.parseArray(el);
		value.rotates = DAERotate.parseArray(el);
		value.link = DAELink.parse(
			DAEUtil.queryChildSelector(el, DAELink.TagName)
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAttachmentFull> {
		return DAEUtil.parseArray<DAEAttachmentFull>(
			this.parse, parent, DAEAttachmentFull.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAttachmentFull.TagName);
		DAEUtil.setAttr(el, "joint", this.joint);
		DAEUtil.addElementArray(el, this.translates);
		DAEUtil.addElementArray(el, this.rotates);
		DAEUtil.addElement(el, this.link);
		return el;
	}
}
