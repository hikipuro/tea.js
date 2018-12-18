import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "../../brep/surfaces/DAESurfaceElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape, surface (B-Rep)
export class DAEPlane implements DAESurfaceElement {
	static readonly TagName: string = "plane";
	equations: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.equations = [];
		this.extras = null;
	}

	static parse(el: Element): DAEPlane {
		if (el == null) {
			return null;
		}
		var value = new DAEPlane();
		value.equations = DAEUtil.getFloatArrayContent(
			DAEUtil.queryChildSelector(el, "equation")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPlane.TagName);
		DAEUtil.addArrayContent(el, "equation", this.equations);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
