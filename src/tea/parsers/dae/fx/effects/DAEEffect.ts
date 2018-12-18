import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEAnnotate } from "./DAEAnnotate";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAEProfile } from "../profiles/DAEProfile";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_effects
export class DAEEffect {
	static readonly TagName: string = "effect";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	annotates?: Array<DAEAnnotate>;
	newparams?: Array<DAENewparam>;
	profiles: Array<DAEProfile>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.annotates = null;
		this.profiles = null;
		this.newparams = null;
		this.profiles = null;
		this.extras = null;
	}

	static parse(el: Element): DAEEffect {
		if (el == null) {
			return null;
		}
		var value = new DAEEffect();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.annotates = DAEAnnotate.parseArray(el);
		value.newparams = DAENewparam.parseArray(el);
		value.profiles = DAEProfile.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEEffect> {
		return DAEUtil.parseArray<DAEEffect>(
			this.parse, parent, DAEEffect.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEEffect.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.annotates);
		DAEUtil.addElementArray(el, this.newparams);
		DAEUtil.addElementArray(el, this.profiles);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
