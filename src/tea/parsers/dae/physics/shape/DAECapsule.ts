import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape
export class DAECapsule {
	static readonly TagName: string = "capsule";
	height: number;
	radius: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.height = 0.0;
		this.radius = [];
		this.extras = null;
	}

	static parse(el: Element): DAECapsule {
		if (el == null) {
			return null;
		}
		var value = new DAECapsule();
		value.height = DAEUtil.getFloatContent(el, "height");
		value.radius = DAEUtil.getFloatArrayContent(
			DAEUtil.queryChildSelector(el, "radius")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECapsule.TagName);
		DAEUtil.addFloatContent(el, "height", this.height);
		DAEUtil.addArrayContent(el, "radius", this.radius);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
