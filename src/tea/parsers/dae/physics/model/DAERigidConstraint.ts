import { DAEUtil } from "../../DAEUtil";
import { DAERefAttachment } from "./DAERefAttachment";
import { DAEAttachment } from "./DAEAttachment";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: physics_model
export class DAERigidConstraint {
	sid?: string;
	name?: string;
	refAttachment: DAERefAttachment;
	attachment: DAEAttachment;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.refAttachment = null;
		this.attachment = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAERigidConstraint {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERigidConstraint();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.refAttachment = DAERefAttachment.parse(
			el.querySelector(":scope > ref_attachment")
		);
		value.attachment = DAERefAttachment.parse(
			el.querySelector(":scope > Attachment")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERigidConstraint> {
		return DAEUtil.parseArray<DAERigidConstraint>(
			this.parse, parent, "rigid_constraint"
		);
	}
}
