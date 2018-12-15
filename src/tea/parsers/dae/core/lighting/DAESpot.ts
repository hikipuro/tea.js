import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "./DAEColor";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: light / technique_common
export class DAESpot {
	static readonly TagName: string = "spot";
	color: DAEColor;
	constantAttenuation?: DAEFloatValue;
	linearAttenuation?: DAEFloatValue;
	quadraticAttenuation?: DAEFloatValue;
	falloffAngle?: DAEFloatValue;
	falloffExponent?: DAEFloatValue;

	constructor() {
		this.color = null;
		this.constantAttenuation = null;
		this.linearAttenuation = null;
		this.quadraticAttenuation = null;
		this.falloffAngle = null;
		this.falloffExponent = null;
	}

	static parse(el: Element): DAESpot {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESpot();
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
		value.falloffAngle = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "falloff_angle")
		);
		value.falloffExponent = DAEFloatValue.parse(
			DAEUtil.queryChildSelector(el, "falloff_exponent")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESpot.TagName);
		DAEUtil.addXML(el, this.color);
		DAEUtil.addXML(el, this.constantAttenuation);
		DAEUtil.addXML(el, this.linearAttenuation);
		DAEUtil.addXML(el, this.quadraticAttenuation);
		DAEUtil.addXML(el, this.falloffAngle);
		DAEUtil.addXML(el, this.falloffExponent);
		return el;
	}
}
