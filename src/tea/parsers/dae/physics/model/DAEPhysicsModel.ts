import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAERigidBody } from "./DAERigidBody";
import { DAERigidConstraint } from "./DAERigidConstraint";
import { DAEInstancePhysicsModel } from "./DAEInstancePhysicsModel";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_physics_models
export class DAEPhysicsModel {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	rigidBodies?: Array<DAERigidBody>;
	rigidConstraints?: Array<DAERigidConstraint>;
	instancePhysicsModels?: Array<DAEInstancePhysicsModel>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.rigidBodies = null;
		this.rigidConstraints = null;
		this.instancePhysicsModels = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPhysicsModel {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhysicsModel();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.rigidBodies = DAERigidBody.parseArray(el);
		value.rigidConstraints = DAERigidConstraint.parseArray(el);
		value.instancePhysicsModels = DAEInstancePhysicsModel.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsModel> {
		return DAEUtil.parseArray<DAEPhysicsModel>(
			this.parse, parent, "physics_model"
		);
	}
}
