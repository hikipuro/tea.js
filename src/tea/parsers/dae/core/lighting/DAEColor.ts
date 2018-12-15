import { DAEUtil } from "../../DAEUtil";

// parent:
// <light>: ambient(core), directional, point, spot
// <profile_COMMON>: fx_common_color_or_texture_type (ambient, 
// emission, diffuse, reflective, specular, transparent)
export class DAEColor {
	static readonly TagName: string = "color";
	sid?: string;
	data: Array<number>;

	constructor() {
		this.sid = null;
		this.data = [];
	}

	static parse(el: Element): DAEColor {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEColor();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.data = DAEUtil.floatArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColor.TagName);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
