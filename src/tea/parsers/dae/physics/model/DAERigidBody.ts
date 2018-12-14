import { DAEUtil } from "../../DAEUtil";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: physics_model
export class DAERigidBody {
	sid?: string;
	name?: string;
	id?: string;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.id = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAERigidBody {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERigidBody();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.id = DAEUtil.stringAttrib(el, "id");
		value.techniqueCommon = DAETechniqueCommon.parse(
			el.querySelector(":scope > technique_common")
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERigidBody> {
		return DAEUtil.parseArray<DAERigidBody>(
			this.parse, parent, "rigid_body"
		);
	}
}
