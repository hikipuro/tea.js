import { DAEUtil } from "../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAELinestrips {
	name?: string;
	count: number;
	material?: string;
	inputs?: Array<DAEInput>;
	data?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.data = null;
		this.extras = null;
	}

	static parse(el: Element): DAELinestrips {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELinestrips();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.inputs = DAEInput.parseArray(el);
		value.data = DAEUtil.intArray(
			el.querySelector("p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
