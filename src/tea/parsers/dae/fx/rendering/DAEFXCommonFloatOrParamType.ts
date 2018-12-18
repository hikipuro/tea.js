import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFXCommonFloatOrParamType {
	static readonly TagName: string = "fx_common_float_or_param_type";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFXCommonFloatOrParamType {
		if (el == null) {
			return null;
		}
		var value = new DAEFXCommonFloatOrParamType();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFXCommonFloatOrParamType.TagName);
		return el;
	}
}
