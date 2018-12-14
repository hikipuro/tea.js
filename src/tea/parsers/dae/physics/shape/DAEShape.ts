import { DAEUtil } from "../../DAEUtil";
import { DAEFloatValue } from "../../core/data/DAEFloatValue";
import { DAEPhysicsMaterial } from "../material/DAEPhysicsMaterial";
import { DAEInstancePhysicsMaterial } from "../material/DAEInstancePhysicsMaterial";
import { DAEPlane } from "./DAEPlane";
import { DAEBox } from "./DAEBox";
import { DAECylinder } from "./DAECylinder";
import { DAECapsule } from "./DAECapsule";
import { DAESphere } from "./DAESphere";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: rigid_body / technique_common, instance_rigid_body / technique_common
export class DAEShape {
	hollow?: boolean;
	mass?: DAEFloatValue;
	density?: DAEFloatValue;
	physicsMaterial?: DAEPhysicsMaterial;
	instancePhysicsMaterial?: DAEInstancePhysicsMaterial;
	plane: DAEPlane;
	box: DAEBox;
	sphere: DAESphere;
	cylinder: DAECylinder;
	capsule: DAECapsule;
	extras?: Array<DAEExtra>;

	constructor() {
		this.hollow = null;
		this.mass = null;
		this.density = null;
		this.physicsMaterial = null;
		this.instancePhysicsMaterial = null;
		this.plane = null;
		this.box = null;
		this.sphere = null;
		this.cylinder = null;
		this.capsule = null;
		this.extras = null;
	}

	static parse(el: Element): DAEShape {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEShape();
		//value.hollow = null;
		value.mass = DAEFloatValue.parse(
			el.querySelector(":scope > mass")
		);
		value.density = DAEFloatValue.parse(
			el.querySelector(":scope > density")
		);
		value.physicsMaterial = DAEPhysicsMaterial.parse(
			el.querySelector(":scope > physics_material")
		);
		value.instancePhysicsMaterial = DAEInstancePhysicsMaterial.parse(
			el.querySelector(":scope > instance_physics_material")
		);
		value.plane = DAEPlane.parse(
			el.querySelector(":scope > plane")
		);
		value.box = DAEBox.parse(
			el.querySelector(":scope > box")
		);
		value.sphere = DAESphere.parse(
			el.querySelector(":scope > sphere")
		);
		value.cylinder = DAECylinder.parse(
			el.querySelector(":scope > cylinder")
		);
		value.capsule = DAECapsule.parse(
			el.querySelector(":scope > capsule")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEShape> {
		return DAEUtil.parseArray<DAEShape>(
			this.parse, parent, "shape"
		);
	}
}
