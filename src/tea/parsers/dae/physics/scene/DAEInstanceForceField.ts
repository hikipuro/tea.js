import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: instance_physics_model, physics_scene
export class DAEInstanceForceField {
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

	static parse(el: Element): DAEInstanceForceField {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceForceField();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceForceField> {
		return DAEUtil.parseArray<DAEInstanceForceField>(
			this.parse, parent, "instance_force_field"
		);
	}
}
