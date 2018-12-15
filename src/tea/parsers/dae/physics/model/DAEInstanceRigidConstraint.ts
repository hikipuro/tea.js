import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: instance_physics_model
export class DAEInstanceRigidConstraint {
	static readonly TagName: string = "instance_rigid_constraint";
	sid?: string;
	name?: string;
	constraint: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.constraint = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceRigidConstraint {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceRigidConstraint();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.constraint = DAEUtil.stringAttrib(el, "constraint");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceRigidConstraint> {
		return DAEUtil.parseArray<DAEInstanceRigidConstraint>(
			this.parse, parent, DAEInstanceRigidConstraint.TagName
		);
	}
}
