import { DAEUtil } from "../../DAEUtil";
import { DAECurveElement } from "./DAECurveElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: curve
export class DAEParabola implements DAECurveElement {
	static readonly TagName: string = "parabola";
	focal: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.focal = null;
		this.extras = null;
	}

	static parse(el: Element): DAEParabola {
		if (el == null) {
			return null;
		}
		var value = new DAEParabola();
		value.focal = DAEUtil.getFloatContent(el, "focal");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEParabola.TagName);
		DAEUtil.addFloatContent(el, "focal", this.focal);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
