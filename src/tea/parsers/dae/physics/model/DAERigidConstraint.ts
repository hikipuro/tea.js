import { DAEUtil } from "../../DAEUtil";
import { DAERefAttachment } from "./DAERefAttachment";
import { DAEAttachment } from "./DAEAttachment";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: physics_model
export class DAERigidConstraint {
	static readonly TagName: string = "rigid_constraint";
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
			DAEUtil.queryChildSelector(el, DAERefAttachment.TagName)
		);
		value.attachment = DAEAttachment.parse(
			DAEUtil.queryChildSelector(el, DAEAttachment.TagName)
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERigidConstraint> {
		return DAEUtil.parseArray<DAERigidConstraint>(
			this.parse, parent, DAERigidConstraint.TagName
		);
	}
}
