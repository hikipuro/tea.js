import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEMaterial } from "./DAEMaterial";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryMaterials {
	static readonly TagName: string = "library_materials";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	materials: Array<DAEMaterial>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.materials = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryMaterials {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryMaterials();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.materials = DAEMaterial.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryMaterials.TagName);
		return el;
	}
}
