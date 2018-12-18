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
			return null;
		}
		var value = new DAEBindFX();
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		value.target = DAEUtil.getStringAttr(el, "target");
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindFX> {
		return DAEUtil.parseArray<DAEBindFX>(
			this.parse, parent, DAEBindFX.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindFX.TagName);
		DAEUtil.setAttr(el, "semantic", this.semantic);
		DAEUtil.setAttr(el, "target", this.target);
		return el;
	}
}
