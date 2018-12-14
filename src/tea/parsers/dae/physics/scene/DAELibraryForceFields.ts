import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEForceField } from "./DAEForceField";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryForceFields {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	forceFields: Array<DAEForceField>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.forceFields = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryForceFields {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryForceFields();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.forceFields = DAEForceField.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
