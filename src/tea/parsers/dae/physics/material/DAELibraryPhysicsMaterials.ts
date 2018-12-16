import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEPhysicsMaterial } from "./DAEPhysicsMaterial";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryPhysicsMaterials {
	static readonly TagName: string = "library_physics_materials";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	physicsMaterials: Array<DAEPhysicsMaterial>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.physicsMaterials = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryPhysicsMaterials {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryPhysicsMaterials();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.physicsMaterials = DAEPhysicsMaterial.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsMaterial.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.physicsMaterials);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
