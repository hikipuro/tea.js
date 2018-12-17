import { DAEUtil } from "../../DAEUtil";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAERotate } from "../../core/transform/DAERotate";

// parent: link
export class DAEAttachmentEnd {
	static readonly TagName: string = "attachment_end";
	joint: string;
	translates: Array<DAETranslate>;
	rotates: Array<DAERotate>;

	constructor() {
		this.joint = null;
		this.translates = null;
		this.rotates = null;
	}

	static parse(el: Element): DAEAttachmentEnd {
		if (el == null) {
			return null;
		}
		var value = new DAEAttachmentEnd();
		value.joint = DAEUtil.getStringAttr(el, "joint");
		value.translates = DAETranslate.parseArray(el);
		value.rotates = DAERotate.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAttachmentEnd> {
		return DAEUtil.parseArray<DAEAttachmentEnd>(
			this.parse, parent, DAEAttachmentEnd.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAttachmentEnd.TagName);
		DAEUtil.setAttr(el, "joint", this.joint);
		DAEUtil.addElementArray(el, this.translates);
		DAEUtil.addElementArray(el, this.rotates);
		return el;
	}
}
