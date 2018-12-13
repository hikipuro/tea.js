import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEAnimation } from "./DAEAnimation";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryAnimations {
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
			el.querySelector("asset")
		);
		value.animations = DAEAnimation.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
