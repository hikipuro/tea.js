import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEEffect } from "./DAEEffect";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryEffects {
	static readonly TagName: string = "library_effects";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	effects: Array<DAEEffect>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.effects = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryEffects {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryEffects();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.effects = DAEEffect.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryEffects.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.effects);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
