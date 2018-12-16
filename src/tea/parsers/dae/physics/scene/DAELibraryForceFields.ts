import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEForceField } from "./DAEForceField";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryForceFields {
	static readonly TagName: string = "library_force_fields";
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
			return null;
		}
		var value = new DAELibraryForceFields();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.forceFields = DAEForceField.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryForceFields.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.forceFields);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
