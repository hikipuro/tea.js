import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "./DAESurfaceElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: surface (B-Rep)
export class DAECylinderBrep implements DAESurfaceElement {
	static readonly TagName: string = "cylinder";
	radius: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.radius = null;
		this.extras = null;
	}

	static parse(el: Element): DAECylinderBrep {
		if (el == null) {
			return null;
		}
		var value = new DAECylinderBrep();
		value.radius = DAEUtil.getFloatContent(el, "radius");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECylinderBrep.TagName);
		DAEUtil.addFloatContent(el, "radius", this.radius);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
