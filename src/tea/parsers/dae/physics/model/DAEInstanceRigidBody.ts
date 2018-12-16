import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";

// TODO: add angular_velocity etc.

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
			return null;
		}
		var value = new DAEInstanceRigidBody();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.body = DAEUtil.getStringAttr(el, "body");
		value.target = DAEUtil.getStringAttr(el, "target");
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

	toXML(): Element {
		var el = document.createElement(DAEInstanceRigidBody.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "body", this.body);
		DAEUtil.setAttr(el, "target", this.target);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
