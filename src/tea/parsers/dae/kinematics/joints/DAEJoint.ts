import { DAEUtil } from "../../DAEUtil";
import { DAEJointType } from "./DAEJointType";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_joints, kinematics_model/technique_common
export class DAEJoint {
	static readonly TagName: string = "joint";
	id?: string;
	name?: string;
	sid?: string;
	jointType: DAEJointType;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.sid = null;
		this.jointType = null;
		this.extras = null;
	}

	static parse(el: Element): DAEJoint {
		if (el == null) {
			return null;
		}
		var value = new DAEJoint();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.jointType = DAEJointType.parse(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEJoint> {
		return DAEUtil.parseArray<DAEJoint>(
			this.parse, parent, DAEJoint.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEJoint.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.addElement(el, this.jointType);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
