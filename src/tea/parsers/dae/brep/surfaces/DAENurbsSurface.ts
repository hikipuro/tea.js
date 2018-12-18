import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "./DAESurfaceElement";
import { DAESource } from "../../core/data/DAESource";
import { DAEControlVertices } from "../../core/geometry/DAEControlVertices";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: surface (B-Rep)
export class DAENurbsSurface implements DAESurfaceElement {
	static readonly TagName: string = "nurbs_surface";
	degreeU: number;
	closedU?: boolean;
	degreeV: number;
	closedV?: boolean;
	sources: Array<DAESource>;
	controlVertices: DAEControlVertices;
	extras?: Array<DAEExtra>;

	constructor() {
		this.degreeU = 0;
		this.closedU = false;
		this.degreeV = 0;
		this.closedV = false;
		this.sources = null;
		this.controlVertices = null;
		this.extras = null;
	}

	static parse(el: Element): DAENurbsSurface {
		if (el == null) {
			return null;
		}
		var value = new DAENurbsSurface();
		value.degreeU = DAEUtil.getIntAttr(el, "degree_u");
		value.closedU = DAEUtil.getBoolAttr(el, "closed_u", false);
		value.degreeV = DAEUtil.getIntAttr(el, "degree_v");
		value.closedV = DAEUtil.getBoolAttr(el, "closed_v", false);
		value.sources = DAESource.parseArray(el);
		value.controlVertices = DAEControlVertices.parse(
			DAEUtil.queryChildSelector(el, DAEControlVertices.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAENurbsSurface.TagName);
		DAEUtil.setAttr(el, "degree_u", this.degreeU);
		DAEUtil.setAttr(el, "closed_u", this.closedU, false);
		DAEUtil.setAttr(el, "degree_v", this.degreeV);
		DAEUtil.setAttr(el, "closed_v", this.closedV, false);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.controlVertices);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
