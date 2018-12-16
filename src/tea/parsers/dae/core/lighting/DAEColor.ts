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
			return null;
		}
		var value = new DAEColor();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEColor.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
