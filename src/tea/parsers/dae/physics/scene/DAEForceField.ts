import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_force_fields
export class DAEForceField {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	techniques: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAEForceField {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEForceField();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEForceField> {
		return DAEUtil.parseArray<DAEForceField>(
			this.parse, parent, "force_field"
		);
	}
}
