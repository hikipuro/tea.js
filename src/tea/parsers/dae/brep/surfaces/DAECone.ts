import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "./DAESurfaceElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: surfaces/surface
export class DAECone implements DAESurfaceElement {
	static readonly TagName: string = "cone";
	radius: number;
	angle: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.radius = null;
		this.angle = null;
		this.extras = null;
	}

	static parse(el: Element): DAECone {
		if (el == null) {
			return null;
		}
		var value = new DAECone();
		value.radius = DAEUtil.getFloatContent(el, "radius");
		value.angle = DAEUtil.getFloatContent(el, "angle");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECone.TagName);
		DAEUtil.addFloatContent(el, "radius", this.radius);
		DAEUtil.addFloatContent(el, "angle", this.angle);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
