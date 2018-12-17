import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEInstanceEffect } from "../effects/DAEInstanceEffect";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_materials
export class DAEMaterial {
	static readonly TagName: string = "material";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	instanceEffect: DAEInstanceEffect;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.instanceEffect = null;
		this.extras = null;
	}

	static parse(el: Element): DAEMaterial {
		if (el == null) {
			return null;
		}
		var value = new DAEMaterial();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.instanceEffect = DAEInstanceEffect.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceEffect.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEMaterial> {
		return DAEUtil.parseArray<DAEMaterial>(
			this.parse, parent, DAEMaterial.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEMaterial.TagName);
		return el;
	}
}
