import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAERigidBody } from "./DAERigidBody";
import { DAERigidConstraint } from "./DAERigidConstraint";
import { DAEInstancePhysicsModel } from "./DAEInstancePhysicsModel";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_physics_models
export class DAEPhysicsModel {
	static readonly TagName: string = "physics_model";
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
			return null;
		}
		var value = new DAEPhysicsModel();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.rigidBodies = DAERigidBody.parseArray(el);
		value.rigidConstraints = DAERigidConstraint.parseArray(el);
		value.instancePhysicsModels = DAEInstancePhysicsModel.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsModel> {
		return DAEUtil.parseArray<DAEPhysicsModel>(
			this.parse, parent, DAEPhysicsModel.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsModel.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.rigidBodies);
		DAEUtil.addElementArray(el, this.rigidConstraints);
		DAEUtil.addElementArray(el, this.instancePhysicsModels);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
