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
			//console.error("parse error");
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
		DAEUtil.addXML(el, this.techniqueCommon);
		DAEUtil.addXMLArray(el, this.techniques);
		DAEUtil.addXMLArray(el, this.extras);
		DAEUtil.addXML(el, this.orthographic);
		DAEUtil.addXML(el, this.perspective);
		return el;
	}
}
