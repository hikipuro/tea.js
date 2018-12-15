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
			//console.error("parse error");
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
		DAEUtil.addXML(el, this.accessor);
		return el;
	}
}
