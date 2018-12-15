import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";

// parent: instance_physics_model
export class DAEInstanceRigidBody {
	static readonly TagName: string = "instance_rigid_body";
	sid?: string;
	name?: string;
	body: string;
	target: string;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.body = "";
		this.target = "";
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceRigidBody {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceRigidBody();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.body = DAEUtil.stringAttrib(el, "body");
		value.target = DAEUtil.stringAttrib(el, "target");
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceRigidBody> {
		return DAEUtil.parseArray<DAEInstanceRigidBody>(
			this.parse, parent, DAEInstanceRigidBody.TagName
		);
	}
}
