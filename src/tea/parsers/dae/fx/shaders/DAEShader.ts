import { DAEUtil } from "../../DAEUtil";
import { DAESources } from "./DAESources";
import { DAECompiler } from "./DAECompiler";
import { DAEBindUniform } from "./DAEBindUniform";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: program
export class DAEShader {
	static readonly TagName: string = "shader";
	stage: string;
	sources: DAESources;
	compilers?: Array<DAECompiler>;
	bindUniforms?: Array<DAEBindUniform>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.stage = null;
		this.sources = null;
		this.compilers = null;
		this.bindUniforms = null;
		this.extras = null;
	}

	static parse(el: Element): DAEShader {
		if (el == null) {
			return null;
		}
		var value = new DAEShader();
		value.stage = DAEUtil.getStringAttr(el, "stage");
		value.sources = DAESources.parse(
			DAEUtil.queryChildSelector(el, DAESources.TagName)
		);
		value.compilers = DAECompiler.parseArray(el);
		value.bindUniforms = DAEBindUniform.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEShader> {
		return DAEUtil.parseArray<DAEShader>(
			this.parse, parent, DAEShader.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEShader.TagName);
		DAEUtil.setAttr(el, "stage", this.stage);
		DAEUtil.addElement(el, this.sources);
		DAEUtil.addElementArray(el, this.compilers);
		DAEUtil.addElementArray(el, this.bindUniforms);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
