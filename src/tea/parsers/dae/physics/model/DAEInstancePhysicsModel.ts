import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAEInstanceForceField } from "../scene/DAEInstanceForceField";
import { DAEInstanceRigidBody } from "./DAEInstanceRigidBody";
import { DAEInstanceRigidConstraint } from "./DAEInstanceRigidConstraint";

// parent: physics_scene, physics_model
export class DAEInstancePhysicsModel {
	static readonly TagName: string = "instance_physics_model";
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
			return null;
		}
		var value = new DAEInstancePhysicsModel();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.parent = DAEUtil.getStringAttr(el, "parent");
		value.instanceForceFields = DAEInstanceForceField.parseArray(el);
		value.instanceRigidBodies = DAEInstanceRigidBody.parseArray(el);
		value.instanceRigidConstraints = DAEInstanceRigidConstraint.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstancePhysicsModel> {
		return DAEUtil.parseArray<DAEInstancePhysicsModel>(
			this.parse, parent, DAEInstancePhysicsModel.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstancePhysicsModel.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.setAttr(el, "parent", this.parent);
		DAEUtil.addElementArray(el, this.instanceForceFields);
		DAEUtil.addElementArray(el, this.instanceRigidBodies);
		DAEUtil.addElementArray(el, this.instanceRigidConstraints);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
