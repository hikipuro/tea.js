import { DAEUtil } from "../../DAEUtil";
import { DAETranslate } from "../../core/transform/DAETranslate";
import { DAERotate } from "../../core/transform/DAERotate";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: rigid_constraint
export class DAERefAttachment {
	static readonly TagName: string = "ref_attachment";
	rigidBody: string;
	translates?: Array<DAETranslate>;
	rotates?: Array<DAERotate>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.rigidBody = "";
		this.translates = null;
		this.rotates = null;
		this.extras = null;
	}

	static parse(el: Element): DAERefAttachment {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERefAttachment();
		value.rigidBody = DAEUtil.stringAttrib(el, "rigid_body");
		value.translates = DAETranslate.parseArray(el);
		value.rotates = DAERotate.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
