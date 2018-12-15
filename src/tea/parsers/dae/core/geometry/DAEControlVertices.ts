import { DAEUtil } from "../../DAEUtil";
import { DAEUnsharedInput } from "../data/DAEUnsharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: spline, nurbs, nurbs_surface
export class DAEControlVertices {
	static readonly TagName: string = "control_vertices";
	inputs: Array<DAEUnsharedInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.inputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAEControlVertices {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEControlVertices();
		value.inputs = DAEUnsharedInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEControlVertices.TagName);
		DAEUtil.addXMLArray(el, this.inputs);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
