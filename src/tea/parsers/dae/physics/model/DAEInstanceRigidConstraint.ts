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
			return null;
		}
		var value = new DAEInstanceRigidConstraint();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.constraint = DAEUtil.getStringAttr(el, "constraint");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceRigidConstraint> {
		return DAEUtil.parseArray<DAEInstanceRigidConstraint>(
			this.parse, parent, DAEInstanceRigidConstraint.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceRigidConstraint.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "constraint", this.constraint);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
