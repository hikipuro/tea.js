import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEPhysicsMaterial } from "./DAEPhysicsMaterial";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryPhysicsMaterials {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryPhysicsMaterials();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.physicsMaterials = DAEPhysicsMaterial.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
