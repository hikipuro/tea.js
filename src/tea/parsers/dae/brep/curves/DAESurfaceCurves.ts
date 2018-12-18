import { DAEUtil } from "../../DAEUtil";
import { DAECurve } from "./DAECurve";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: brep
export class DAESurfaceCurves {
	static readonly TagName: string = "surface_curves";
	curves: Array<DAECurve>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.curves = null;
		this.extras = null;
	}

	static parse(el: Element): DAESurfaceCurves {
		if (el == null) {
			return null;
		}
		var value = new DAESurfaceCurves();
		value.curves = DAECurve.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESurfaceCurves.TagName);
		DAEUtil.addElementArray(el, this.curves);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
