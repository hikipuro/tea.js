import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEAnimation } from "./DAEAnimation";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryAnimations {
	static readonly TagName: string = "library_animations";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	animations: Array<DAEAnimation>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.animations = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryAnimations {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryAnimations();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.animations = DAEAnimation.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryAnimations.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.animations);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
