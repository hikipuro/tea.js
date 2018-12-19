import { DAEUtil } from "../../DAEUtil";
import { DAEParameterElement } from "./DAEParameterElement";

// TODO: fix parameter elements

// parent: 
// core: newparam, setparam
// fx: create_2d, create_3d, create_cube
// profile: CG, GLES2, GLSL
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
			return null;
		}
		var value = new DAEArray();
		value.length = DAEUtil.getIntAttr(el, "length");
		value.resizable = DAEUtil.getBoolAttr(el, "resizable", false);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEArray.TagName);
		DAEUtil.setAttr(el, "length", this.length);
		DAEUtil.setAttr(el, "resizable", this.resizable, false);
		return el;
	}
}
