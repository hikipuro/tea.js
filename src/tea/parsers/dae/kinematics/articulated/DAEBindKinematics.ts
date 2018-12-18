import { DAEUtil } from "../../DAEUtil";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";

// TODO: fix

// parent: instance_articulated_system, instance_kinematics_model,
// motion/axis_info, effector_info
export class DAEBindKinematics {
	static readonly TagName: string = "bind";
	symbol: string;
	param: DAEParamRef;

	constructor() {
		this.symbol = null;
		this.param = null;
	}

	static parse(el: Element): DAEBindKinematics {
		if (el == null) {
			return null;
		}
		var value = new DAEBindKinematics();
		value.symbol = DAEUtil.getStringAttr(el, "symbol");
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindKinematics> {
		return DAEUtil.parseArray<DAEBindKinematics>(
			this.parse, parent, DAEBindKinematics.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindKinematics.TagName);
		DAEUtil.setAttr(el, "symbol", this.symbol);
		DAEUtil.addElement(el, this.param);
		return el;
	}
}
