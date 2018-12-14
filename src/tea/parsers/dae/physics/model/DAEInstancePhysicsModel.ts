import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAEInstanceForceField } from "../scene/DAEInstanceForceField";
import { DAEInstanceRigidBody } from "./DAEInstanceRigidBody";
import { DAEInstanceRigidConstraint } from "./DAEInstanceRigidConstraint";

// parent: physics_scene, physics_model
export class DAEInstancePhysicsModel {
	sid?: string;
	name?: string;
	url: string;
	parent?: string;
	instanceForceFields?: Array<DAEInstanceForceField>;
	instanceRigidBodies?: Array<DAEInstanceRigidBody>;
	instanceRigidConstraints?: Array<DAEInstanceRigidConstraint>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.parent = null;
		this.instanceForceFields = null;
		this.instanceRigidBodies = null;
		this.instanceRigidConstraints = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstancePhysicsModel {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstancePhysicsModel();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url");
		value.parent = DAEUtil.stringAttrib(el, "parent");
		value.instanceForceFields = DAEInstanceForceField.parseArray(el);
		value.instanceRigidBodies = DAEInstanceRigidBody.parseArray(el);
		value.instanceRigidConstraints = DAEInstanceRigidConstraint.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstancePhysicsModel> {
		return DAEUtil.parseArray<DAEInstancePhysicsModel>(
			this.parse, parent, "instance_physics_model"
		);
	}
}
