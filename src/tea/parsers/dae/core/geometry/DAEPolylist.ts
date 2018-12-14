import { DAEUtil } from "../../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh
export class DAEPolylist {
	name?: string;
	count: number;
	material: string;
	inputs?: Array<DAEInput>;
	vcount?: Array<number>;
	p?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.vcount = null;
		this.p = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPolylist {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPolylist();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.inputs = DAEInput.parseArray(el);
		value.vcount = DAEUtil.intArray(
			el.querySelector(":scope > vcount")
		);
		value.p = DAEUtil.intArray(
			el.querySelector(":scope > p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
