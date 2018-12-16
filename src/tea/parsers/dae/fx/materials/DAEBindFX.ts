import { DAEUtil } from "../../DAEUtil";

// parent: instance_material (geometry), instance_material (rendering)
export class DAEBindFX {
	static readonly TagName: string = "bind";
	semantic: string;
	target: string;

	constructor() {
		this.semantic = null;
		this.target = null;
	}

	static parse(el: Element): DAEBindFX {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindFX();
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		value.target = DAEUtil.getStringAttr(el, "target");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindFX.TagName);
		return el;
	}
}
