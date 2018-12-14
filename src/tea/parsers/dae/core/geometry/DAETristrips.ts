import { DAEUtil } from "../../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAETristrips {
	name?: string;
	count: number;
	material?: string;
	inputs?: Array<DAEInput>;
	data: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.data = [];
		this.extras = null;
	}

	static parse(el: Element): DAETristrips {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETristrips();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.inputs = DAEInput.parseArray(el);
		value.data = DAEUtil.intArray(
			el.querySelector(":scope > p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
