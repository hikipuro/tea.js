import { DAEUtil } from "../../DAEUtil";
import { DAECurveElement } from "./DAECurveElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: curve
export class DAECircle implements DAECurveElement {
	static readonly TagName: string = "circle";
	radius: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.radius = null;
		this.extras = null;
	}

	static parse(el: Element): DAECircle {
		if (el == null) {
			return null;
		}
		var value = new DAECircle();
		value.radius = DAEUtil.getFloatContent(el, "radius");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECircle.TagName);
		DAEUtil.addFloatContent(el, "radius", this.radius);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
