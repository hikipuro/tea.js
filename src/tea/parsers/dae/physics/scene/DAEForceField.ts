import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_force_fields
export class DAEForceField {
	static readonly TagName: string = "force_field";
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
			return null;
		}
		var value = new DAEForceField();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEForceField> {
		return DAEUtil.parseArray<DAEForceField>(
			this.parse, parent, DAEForceField.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEForceField.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
