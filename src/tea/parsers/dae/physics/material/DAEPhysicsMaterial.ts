import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// TODO: add dynamic_friction, restitution, static_friction

// parent: library_physics_materials, shape, instance_rigid_body /
// technique_common, rigid_body / technique_common
export class DAEPhysicsMaterial {
	static readonly TagName: string = "physics_material";
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
			return null;
		}
		var value = new DAEPhysicsMaterial();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPhysicsMaterial> {
		return DAEUtil.parseArray<DAEPhysicsMaterial>(
			this.parse, parent, DAEPhysicsMaterial.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsMaterial.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
