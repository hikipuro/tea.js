import { DAEUtil } from "../../DAEUtil";
import { DAEFloat } from "./DAEFloat";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";

// parent: constant (FX), lambert, phong, blinn
export class DAEIndexOfRefraction {
	static readonly TagName: string = "index_of_refraction";
	float?: DAEFloat;
	param?: DAEParamRef;

	constructor() {
		this.float = null;
		this.param = null;
	}

	static parse(el: Element): DAEIndexOfRefraction {
		if (el == null) {
			return null;
		}
		var value = new DAEIndexOfRefraction();
		value.float = DAEFloat.parse(
			DAEUtil.queryChildSelector(el, DAEFloat.TagName)
		);
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEIndexOfRefraction.TagName);
		DAEUtil.addElement(el, this.float);
		DAEUtil.addElement(el, this.param);
		return el;
	}
}
