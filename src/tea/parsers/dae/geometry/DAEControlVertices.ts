import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: spline, nurbs, nurbs_surface
export class DAEControlVertices {
	inputs: Array<DAEInput>;
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
		value.inputs = DAEInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
