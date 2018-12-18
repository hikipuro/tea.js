import { DAEUtil } from "../../DAEUtil";
import { DAECurveElement } from "./DAECurveElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: curve
export class DAELine implements DAECurveElement {
	static readonly TagName: string = "line";
	origin: Array<number>;
	direction: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.origin = null;
		this.direction = null;
		this.extras = null;
	}

	static parse(el: Element): DAELine {
		if (el == null) {
			return null;
		}
		var value = new DAELine();
		value.origin = DAEUtil.getFloatArrayContent(el, "origin");
		value.direction = DAEUtil.getFloatArrayContent(el, "direction");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELine.TagName);
		DAEUtil.addArrayContent(el, "origin", this.origin);
		DAEUtil.addArrayContent(el, "direction", this.direction);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
