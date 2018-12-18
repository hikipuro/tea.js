import { DAEUtil } from "../../DAEUtil";
import { DAECurveElement } from "./DAECurveElement";
import { DAEOrient } from "../transformation/DAEOrient";
import { DAEOrigin } from "../transformation/DAEOrigin";

// parent: curves, surface_curves, swept_surface
export class DAECurve {
	static readonly TagName: string = "curve";
	sid?: string;
	name?: string;
	curveElement: DAECurveElement;
	orients?: Array<DAEOrient>;
	origin?: DAEOrigin;

	constructor() {
		this.sid = null;
		this.name = null;
		this.curveElement = null;
		this.orients = null;
		this.origin = null;
	}

	static parse(el: Element): DAECurve {
		if (el == null) {
			return null;
		}
		var value = new DAECurve();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.curveElement = DAECurveElement.parse(el);
		value.orients = DAEOrient.parseArray(el);
		value.origin = DAEOrigin.parse(
			DAEUtil.queryChildSelector(el, DAEOrigin.TagName)
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAECurve> {
		return DAEUtil.parseArray<DAECurve>(
			this.parse, parent, DAECurve.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAECurve.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.curveElement);
		DAEUtil.addElementArray(el, this.orients);
		DAEUtil.addElement(el, this.origin);
		return el;
	}
}
