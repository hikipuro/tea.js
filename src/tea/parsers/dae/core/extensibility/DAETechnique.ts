import { DAEUtil } from "../../DAEUtil";

// parent: extra, source(core), light, optics, imager, force_field, physics_material, 
// physics_scene, rigid_body, rigid_constraint, instance_rigid_body, 
// bind_material, motion, kinematics, kinematics_model
export class DAETechnique {
	profile: string;
	xmlns?: string;

	constructor() {
		this.profile = null;
		this.xmlns = null;
	}

	static parse(el: Element): DAETechnique {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETechnique();
		value.profile = DAEUtil.stringAttrib(el, "profile");
		value.xmlns = DAEUtil.stringAttrib(el, "xmlns");
		return value;
	}

	static parseArray(parent: Element): Array<DAETechnique> {
		return DAEUtil.parseArray<DAETechnique>(
			this.parse, parent, "technique"
		);
	}
}
