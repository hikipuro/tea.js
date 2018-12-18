import { DAEUtil } from "../../DAEUtil";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";

// TODO: fix

// parent: instance_kinematics_scene
export class DAEBindKinematicsModel {
	static readonly TagName: string = "bind_kinematics_model";
	node?: string;
	param: DAEParamRef;

	constructor() {
		this.node = null;
		this.param = null;
	}

	static parse(el: Element): DAEBindKinematicsModel {
		if (el == null) {
			return null;
		}
		var value = new DAEBindKinematicsModel();
		value.node = DAEUtil.getStringAttr(el, "node");
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindKinematicsModel> {
		return DAEUtil.parseArray<DAEBindKinematicsModel>(
			this.parse, parent, DAEBindKinematicsModel.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindKinematicsModel.TagName);
		DAEUtil.setAttr(el, "node", this.node);
		return el;
	}
}
