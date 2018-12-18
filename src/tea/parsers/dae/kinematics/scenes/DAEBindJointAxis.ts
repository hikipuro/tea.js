import { DAEUtil } from "../../DAEUtil";

// TODO: fix

// parent: instance_kinematics_scene
export class DAEBindJointAxis {
	static readonly TagName: string = "bind_joint_axis";
	target?: string;
	//axis:
	//value:

	constructor() {
		this.target = null;
	}

	static parse(el: Element): DAEBindJointAxis {
		if (el == null) {
			return null;
		}
		var value = new DAEBindJointAxis();
		value.target = DAEUtil.getStringAttr(el, "target");
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindJointAxis> {
		return DAEUtil.parseArray<DAEBindJointAxis>(
			this.parse, parent, DAEBindJointAxis.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindJointAxis.TagName);
		DAEUtil.setAttr(el, "target", this.target);
		return el;
	}
}
