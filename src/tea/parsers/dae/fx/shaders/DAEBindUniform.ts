import { DAEUtil } from "../../DAEUtil";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";
import { DAEParameterTypeElement } from "../../core/parameters/DAEParameterTypeElement";

// parent: shader (CG), program (GLSL2, GLSL)
export class DAEBindUniform {
	static readonly TagName: string = "bind_uniform";
	symbol: string;
	param?: DAEParamRef;
	parameterTypeElement: DAEParameterTypeElement;

	constructor() {
		this.symbol = null;
		this.param = null;
		this.parameterTypeElement = null;
	}

	static parse(el: Element): DAEBindUniform {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindUniform();
		value.symbol = DAEUtil.getStringAttr(el, "symbol");
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		//value.parameterTypeElement = DAEParameterTypeElement.parse(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEBindUniform> {
		return DAEUtil.parseArray<DAEBindUniform>(
			this.parse, parent, DAEBindUniform.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEBindUniform.TagName);
		return el;
	}
}
