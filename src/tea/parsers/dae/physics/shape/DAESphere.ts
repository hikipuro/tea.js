import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "../../brep/surfaces/DAESurfaceElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape, surface (B-Rep)
export class DAESphere implements DAESurfaceElement {
	static readonly TagName: string = "sphere";
	radius: number;
	extras?: Array<DAEExtra>;

	constructor() {
		this.radius = null;
		this.extras = null;
	}

	static parse(el: Element): DAESphere {
		if (el == null) {
			return null;
		}
		var value = new DAESphere();
		value.radius = DAEUtil.getFloatContent(el, "radius");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESphere.TagName);
		DAEUtil.addFloatContent(el, "radius", this.radius);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
