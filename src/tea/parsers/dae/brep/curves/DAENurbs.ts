import { DAEUtil } from "../../DAEUtil";
import { DAECurveElement } from "./DAECurveElement";
import { DAESource } from "../../core/data/DAESource";
import { DAEControlVertices } from "../../core/geometry/DAEControlVertices";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: curve
export class DAENurbs implements DAECurveElement {
	static readonly TagName: string = "nurbs";
	degree: number;
	closed?: boolean;
	sources: Array<DAESource>;
	controlVertices: DAEControlVertices;
	extras?: Array<DAEExtra>;

	constructor() {
		this.degree = null;
		this.closed = false;
		this.sources = null;
		this.controlVertices = null;
		this.extras = null;
	}

	static parse(el: Element): DAENurbs {
		if (el == null) {
			return null;
		}
		var value = new DAENurbs();
		value.degree = DAEUtil.getIntAttr(el, "degree");
		value.closed = DAEUtil.getBoolAttr(el, "closed", false);
		value.sources = DAESource.parseArray(el);
		value.controlVertices = DAEControlVertices.parse(
			DAEUtil.queryChildSelector(el, DAEControlVertices.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAENurbs.TagName);
		DAEUtil.setAttr(el, "degree", this.degree);
		DAEUtil.setAttr(el, "closed", this.closed, false);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.controlVertices);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
