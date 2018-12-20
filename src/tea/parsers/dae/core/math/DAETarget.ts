import { DAEUtil } from "../../DAEUtil";
import { DAEFloat } from "../../fx/rendering/DAEFloat";
import { DAEParamRef } from "../parameters/DAEParamRef";

// parent: formula
export class DAETarget {
	static readonly TagName: string = "target";
	float?: DAEFloat;
	param?: DAEParamRef;

	constructor() {
		this.float = null;
		this.param = null;
	}

	static parse(el: Element): DAETarget {
		if (el == null) {
			return null;
		}
		var value = new DAETarget();
		value.float = DAEFloat.parse(
			DAEUtil.queryChildSelector(el, DAEFloat.TagName)
		);
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETarget.TagName);
		DAEUtil.addElement(el, this.float);
		DAEUtil.addElement(el, this.param);
		return el;
	}
}
