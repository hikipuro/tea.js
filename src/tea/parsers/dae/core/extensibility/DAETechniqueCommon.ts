import { DAEAccessor } from "../data/DAEAccessor";

// parent: bind_material, instance_rigid_body, light, optics, physics_material, 
// physics_scene, rigid_body, rigid_constraint, source(core), motion, 
// kinematics, kinematics_model
export class DAETechniqueCommon {
	accessor: DAEAccessor;

	constructor() {
		this.accessor = null;
	}

	static parse(el: Element): DAETechniqueCommon {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETechniqueCommon();
		value.accessor = DAEAccessor.parse(
			el.querySelector(":scope > accessor")
		);
		return value;
	}
}
