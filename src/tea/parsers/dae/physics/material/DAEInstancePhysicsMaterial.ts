import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: rigid_body / technique_common,
// instance_rigid_body / technique_common, shape
export class DAEInstancePhysicsMaterial {
	sid?: string;
	name?: string;
	url: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstancePhysicsMaterial {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstancePhysicsMaterial();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
