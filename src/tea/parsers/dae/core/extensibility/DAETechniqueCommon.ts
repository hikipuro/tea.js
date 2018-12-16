import { DAEUtil } from "../../DAEUtil";
import { DAEAccessor } from "../data/DAEAccessor";

// parent: bind_material, instance_rigid_body, light, optics, physics_material, 
// physics_scene, rigid_body, rigid_constraint, source(core), motion, 
// kinematics, kinematics_model
export class DAETechniqueCommon {
	static readonly TagName: string = "technique_common";
	accessor: DAEAccessor;

	constructor() {
		this.accessor = null;
	}

	static parse(el: Element): DAETechniqueCommon {
		if (el == null) {
			return null;
		}
		var value = new DAETechniqueCommon();
		value.accessor = DAEAccessor.parse(
			DAEUtil.queryChildSelector(el, DAEAccessor.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueCommon.TagName);
		DAEUtil.addElement(el, this.accessor);
		return el;
	}
}
