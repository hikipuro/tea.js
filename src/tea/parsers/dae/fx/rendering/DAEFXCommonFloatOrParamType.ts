import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFXCommonFloatOrParamType {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFXCommonFloatOrParamType {
		if (el == null) {
			//console.error("parse error");
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
