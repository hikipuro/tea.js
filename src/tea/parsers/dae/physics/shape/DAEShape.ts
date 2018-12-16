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
	static readonly TagName: string = "shape";
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
			return null;
		}
		var value = new DAEShape();
		//value.hollow = null;
		value.mass = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "mass")
		);
		value.density = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "density")
		);
		value.physicsMaterial = DAEPhysicsMaterial.parse(
			DAEUtil.queryChildSelector(el, "physics_material")
		);
		value.instancePhysicsMaterial = DAEInstancePhysicsMaterial.parse(
			DAEUtil.queryChildSelector(el, "instance_physics_material")
		);
		value.plane = DAEPlane.parse(
			DAEUtil.queryChildSelector(el, "plane")
		);
		value.box = DAEBox.parse(
			DAEUtil.queryChildSelector(el, "box")
		);
		value.sphere = DAESphere.parse(
			DAEUtil.queryChildSelector(el, "sphere")
		);
		value.cylinder = DAECylinder.parse(
			DAEUtil.queryChildSelector(el, "cylinder")
		);
		value.capsule = DAECapsule.parse(
			DAEUtil.queryChildSelector(el, "capsule")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEShape> {
		return DAEUtil.parseArray<DAEShape>(
			this.parse, parent, DAEShape.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEShape.TagName);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
