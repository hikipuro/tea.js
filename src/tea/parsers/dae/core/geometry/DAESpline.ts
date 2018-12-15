import { DAEUtil } from "../../DAEUtil";
import { DAEGeometricElement } from "./DAEGeometricElement";
import { DAESource } from "../data/DAESource";
import { DAEControlVertices } from "./DAEControlVertices";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: geometry
export class DAESpline implements DAEGeometricElement {
	static readonly TagName: string = "spline";
	closed?: boolean;
	sources: Array<DAESource>;
	controlVertices: DAEControlVertices;
	extras?: Array<DAEExtra>;

	constructor() {
		this.closed = false;
		this.sources = null;
		this.controlVertices = null;
		this.extras = null;
	}

	static parse(el: Element): DAESpline {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESpline();
		value.closed = DAEUtil.boolAttrib(el, "closed", false);
		value.sources = DAESource.parseArray(el);
		value.controlVertices = DAEControlVertices.parse(
			DAEUtil.queryChildSelector(el, DAEControlVertices.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESpline.TagName);
		DAEUtil.setAttribute(el, "closed", this.closed);
		DAEUtil.addXMLArray(el, this.sources);
		DAEUtil.addXML(el, this.controlVertices);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
