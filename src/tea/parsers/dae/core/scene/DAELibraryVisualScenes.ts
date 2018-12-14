import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEVisualScene } from "./DAEVisualScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryVisualScenes {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	visualScenes: Array<DAEVisualScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.visualScenes = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryVisualScenes {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryVisualScenes();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.visualScenes = DAEVisualScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
