import { DAEUtil } from "../../DAEUtil";
import { DAEShader } from "./DAEShader";
import { DAELinker } from "./DAELinker";
import { DAEBindAttribute } from "./DAEBindAttribute";
import { DAEBindUniform } from "./DAEBindUniform";

// parent: pass
export class DAEProgram {
	static readonly TagName: string = "program";
	shaders?: Array<DAEShader>;
	linkers?: Array<DAELinker>;
	bindAttributes?: Array<DAEBindAttribute>;
	bindUniforms?: Array<DAEBindUniform>;

	constructor() {
		this.shaders = null;
		this.linkers = null;
		this.bindAttributes = null;
		this.bindUniforms = null;
	}

	static parse(el: Element): DAEProgram {
		if (el == null) {
			return null;
		}
		var value = new DAEProgram();
		value.shaders = DAEShader.parseArray(el);
		value.linkers = DAELinker.parseArray(el);
		value.bindAttributes = DAEBindAttribute.parseArray(el);
		value.bindUniforms = DAEBindUniform.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEProgram.TagName);
		return el;
	}
}
