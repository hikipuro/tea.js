import { DAEUtil } from "../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAEControlVertices } from "./DAEControlVertices";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: geometry
export class DAESpline {
	closed?: boolean;
	sources: Array<DAESource>;
	controlVertices: DAEControlVertices;
	extras?: Array<DAEExtra>;

	constructor() {
		this.closed = false;
		this.sources = null;
		this.controlVertices = null;
		this.extras = null;
	}

	static parse(el: Element): DAESpline {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESpline();
		value.closed = DAEUtil.boolAttrib(el, "closed", false);
		value.sources = DAESource.parseArray(el);
		value.controlVertices = DAEControlVertices.parse(
			el.querySelector("control_vertices")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
