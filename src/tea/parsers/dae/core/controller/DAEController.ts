import { DAEUtil } from "../../DAEUtil";
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEController();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.skin = DAESkin.parse(
			el.querySelector(":scope > skin")
		);
		value.morph = DAEMorph.parse(
			el.querySelector(":scope > morph")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEController> {
		return DAEUtil.parseArray<DAEController>(
			this.parse, parent, "controller"
		);
	}

	toXML(): Element {
		var el = document.createElement("controller");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXML(el, this.skin);
		DAEUtil.addXML(el, this.morph);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
