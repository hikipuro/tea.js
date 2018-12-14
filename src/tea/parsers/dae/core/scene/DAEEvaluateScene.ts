import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: visual_scene
export class DAEEvaluateScene {
	id?: string;
	name?: string;
	sid?: string;
	enable?: boolean;
	asset?: DAEAsset;
	//renders?: Array<any>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.sid = null;
		this.enable = true;
		this.asset = null;
	}

	static parse(el: Element): DAEEvaluateScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEEvaluateScene();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.enable = DAEUtil.boolAttrib(el, "enable", true);
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEEvaluateScene> {
		return DAEUtil.parseArray<DAEEvaluateScene>(
			this.parse, parent, "evaluate_scene"
		);
	}
}