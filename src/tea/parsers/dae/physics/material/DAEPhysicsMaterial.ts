import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_physics_materials, shape, instance_rigid_body /
// technique_common, rigid_body / technique_common
export class DAEPhysicsMaterial {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPhysicsMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhysicsMaterial();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsMaterial> {
		return DAEUtil.parseArray<DAEPhysicsMaterial>(
			this.parse, parent, "physics_material"
		);
	}
}
