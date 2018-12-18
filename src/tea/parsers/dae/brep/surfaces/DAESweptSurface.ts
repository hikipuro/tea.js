import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "./DAESurfaceElement";
import { DAECurve } from "../curves/DAECurve";
import { DAEOrigin } from "../transformation/DAEOrigin";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: surface (B-Rep)
export class DAESweptSurface implements DAESurfaceElement {
	static readonly TagName: string = "swept_surface";
	curve: DAECurve;
	direction: number;
	origin: DAEOrigin;
	axis: Array<number>;
	extras?: Array<DAEExtra>;
	
	constructor() {
		this.curve = null;
		this.direction = null;
		this.origin = null;
		this.axis = null;
		this.extras = null;
	}

	static parse(el: Element): DAESweptSurface {
		if (el == null) {
			return null;
		}
		var value = new DAESweptSurface();
		value.curve = DAECurve.parse(
			DAEUtil.queryChildSelector(el, DAECurve.TagName)
		);
		value.direction = DAEUtil.getFloatContent(el, "direction");
		value.origin = DAEOrigin.parse(
			DAEUtil.queryChildSelector(el, DAEOrigin.TagName)
		);
		value.axis = DAEUtil.getFloatArrayContent(el, "axis");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESweptSurface.TagName);
		DAEUtil.addElement(el, this.curve);
		DAEUtil.addFloatContent(el, "direction", this.direction);
		DAEUtil.addElement(el, this.origin);
		DAEUtil.addArrayContent(el, "axis", this.axis);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
