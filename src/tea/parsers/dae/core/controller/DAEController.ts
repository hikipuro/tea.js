import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESkin } from "./DAESkin";
import { DAEMorph } from "./DAEMorph";

// parent: library_controllers
export class DAEController {
	static readonly TagName: string = "controller";
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
			return null;
		}
		var value = new DAEController();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.skin = DAESkin.parse(
			DAEUtil.queryChildSelector(el, DAESkin.TagName)
		);
		value.morph = DAEMorph.parse(
			DAEUtil.queryChildSelector(el, DAEMorph.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEController> {
		return DAEUtil.parseArray<DAEController>(
			this.parse, parent, DAEController.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEController.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElement(el, this.skin);
		DAEUtil.addElement(el, this.morph);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
