import { DAEColor } from "./DAEColor";
import { DAEFloatValue } from "../data/DAEFloatValue";

// parent: light / technique_common
export class DAESpot {
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
			el.querySelector("color")
		);
		value.constantAttenuation = DAEFloatValue.parse(
			el.querySelector("constant_attenuation"), 1.0
		);
		value.linearAttenuation = DAEFloatValue.parse(
			el.querySelector("linear_attenuation"), 0.0
		);
		value.quadraticAttenuation = DAEFloatValue.parse(
			el.querySelector("quadratic_attenuation")
		);
		value.falloffAngle = DAEFloatValue.parse(
			el.querySelector("falloff_angle")
		);
		value.falloffExponent = DAEFloatValue.parse(
			el.querySelector("falloff_exponent")
		);
		return value;
	}
}
