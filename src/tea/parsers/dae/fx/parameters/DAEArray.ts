import { DAEUtil } from "../../DAEUtil";
import { DAEParameterElement } from "./DAEParameterElement";

// parent: 
// core: newparam, setparam
// fx: create_2d, create_3d, create_cube
export class DAEArray {
	static readonly TagName: string = "array";
	length: number;
	resizable?: boolean;
	parameterElements?: Array<DAEParameterElement>;

	constructor() {
		this.length = 0;
		this.resizable = false;
		this.parameterElements = null;
	}

	static parse(el: Element): DAEArray {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEArray();
		value.length = DAEUtil.getIntAttr(el, "length");
		value.resizable = DAEUtil.getBoolAttr(el, "resizable", false);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEArray.TagName);
		return el;
	}
}
