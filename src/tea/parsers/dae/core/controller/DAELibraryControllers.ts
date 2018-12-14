import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEController } from "./DAEController";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryControllers {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	controllers: Array<DAEController>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.controllers = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryControllers {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryControllers();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.controllers = DAEController.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
