import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "./DAEColor";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: light / technique_common
export class DAEPoint {
	static readonly TagName: string = "point";
	color: DAEColor;
	constantAttenuation?: DAEFloatValue;
	linearAttenuation?: DAEFloatValue;
	quadraticAttenuation?: DAEFloatValue;

	constructor() {
		this.color = null;
		this.constantAttenuation = null;
		this.linearAttenuation = null;
		this.quadraticAttenuation = null;
	}

	static parse(el: Element): DAEPoint {
		if (el == null) {
			return null;
		}
		var value = new DAEPoint();
		value.color = DAEColor.parse(
			DAEUtil.queryChildSelector(el, DAEColor.TagName)
		);
		value.constantAttenuation = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "constant_attenuation"), 1.0
		);
		value.linearAttenuation = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "linear_attenuation"), 0.0
		);
		value.quadraticAttenuation = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "quadratic_attenuation")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPoint.TagName);
		DAEUtil.addElement(el, this.color);
		DAEUtil.addElement(el, this.constantAttenuation);
		DAEUtil.addElement(el, this.linearAttenuation);
		DAEUtil.addElement(el, this.quadraticAttenuation);
		return el;
	}
}
