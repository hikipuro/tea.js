import { DAEUtil } from "../../DAEUtil";

// parent: extra, source(core), light, optics, imager, force_field, physics_material, 
// physics_scene, rigid_body, rigid_constraint, instance_rigid_body, 
// bind_material, motion, kinematics, kinematics_model
export class DAETechnique {
	static readonly TagName: string = "technique";
	profile: string;
	xmlns?: string;

	constructor() {
		this.profile = null;
		this.xmlns = null;
	}

	static parse(el: Element): DAETechnique {
		if (el == null) {
			return null;
		}
		var value = new DAETechnique();
		value.profile = DAEUtil.getStringAttr(el, "profile");
		value.xmlns = DAEUtil.getStringAttr(el, "xmlns");
		return value;
	}

	static parseArray(parent: Element): Array<DAETechnique> {
		return DAEUtil.parseArray<DAETechnique>(
			this.parse, parent, DAETechnique.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETechnique.TagName);
		DAEUtil.setAttr(el, "profile", this.profile);
		DAEUtil.setAttr(el, "xmlns", this.xmlns);
		return el;
	}
}
