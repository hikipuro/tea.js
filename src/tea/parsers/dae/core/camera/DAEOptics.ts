import { DAEUtil } from "../../DAEUtil";
import { DAETechniqueCommon } from "../extensibility/DAETechniqueCommon";
import { DAETechnique } from "../extensibility/DAETechnique";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEOrthographic } from "./DAEOrthographic";
import { DAEPerspective } from "./DAEPerspective";

// parent: camera
export class DAEOptics {
	static readonly TagName: string = "optics";
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;
	orthographic?: DAEOrthographic;
	perspective?: DAEPerspective;

	constructor() {
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
		this.orthographic = null;
		this.perspective = null;
	}

	static parse(el: Element): DAEOptics {
		if (el == null) {
			return null;
		}
		var value = new DAEOptics();
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		value.orthographic = DAEOrthographic.parse(
			DAEUtil.queryChildSelector(el, DAEOrthographic.TagName)
		);
		value.perspective = DAEPerspective.parse(
			DAEUtil.queryChildSelector(el, DAEPerspective.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEOptics.TagName);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		DAEUtil.addElement(el, this.orthographic);
		DAEUtil.addElement(el, this.perspective);
		return el;
	}
}
