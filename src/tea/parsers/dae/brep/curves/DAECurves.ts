import { DAEUtil } from "../../DAEUtil";
import { DAECurve } from "./DAECurve";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: brep
export class DAECurves {
	static readonly TagName: string = "curves";
	curves: Array<DAECurve>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.curves = null;
		this.extras = null;
	}

	static parse(el: Element): DAECurves {
		if (el == null) {
			return null;
		}
		var value = new DAECurves();
		value.curves = DAECurve.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECurves.TagName);
		DAEUtil.addElement(el, this.curves);
		DAEUtil.addElement(el, this.extras);
		return el;
	}
}
