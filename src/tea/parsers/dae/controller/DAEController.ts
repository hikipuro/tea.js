import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESkin } from "./DAESkin";
import { DAEMorph } from "./DAEMorph";

// parent: library_controllers
export class DAEController {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	skin: DAESkin;
	morph: DAEMorph;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.skin = null;
		this.morph = null;
		this.extras = null;
	}

	static parse(el: Element): DAEController {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEController();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.skin = DAESkin.parse(
			el.querySelector("skin")
		);
		value.morph = DAEMorph.parse(
			el.querySelector("morph")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEController> {
		return DAEUtil.parseArray<DAEController>(
			this.parse, parent, "controller"
		);
	}
}
