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
			return null;
		}
		var value = new DAESpline();
		value.closed = DAEUtil.getBoolAttr(el, "closed", false);
		value.sources = DAESource.parseArray(el);
		value.controlVertices = DAEControlVertices.parse(
			DAEUtil.queryChildSelector(el, DAEControlVertices.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESpline.TagName);
		DAEUtil.setAttr(el, "closed", this.closed, false);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.controlVertices);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
