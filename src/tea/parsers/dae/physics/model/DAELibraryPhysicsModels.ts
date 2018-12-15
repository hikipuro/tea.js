import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEPhysicsModel } from "./DAEPhysicsModel";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryPhysicsModels {
	static readonly TagName: string = "library_physics_models";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	physicsModels: Array<DAEPhysicsModel>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.physicsModels = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryPhysicsModels {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryPhysicsModels();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.physicsModels = DAEPhysicsModel.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
