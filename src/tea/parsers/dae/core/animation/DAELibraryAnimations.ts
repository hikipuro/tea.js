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
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryAnimations();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.animations = DAEAnimation.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryAnimations.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.animations);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
