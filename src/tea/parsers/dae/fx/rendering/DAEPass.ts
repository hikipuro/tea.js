import { DAEUtil } from "../../DAEUtil";
import { DAEAnnotate } from "../effects/DAEAnnotate";
import { DAEStates } from "./DAEStates";
import { DAEProgram } from "../shaders/DAEProgram";
import { DAEEvaluate } from "./DAEEvaluate";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: technique (FX) (profile_CG, profile_GLES, profile_GLSL, profile_GLES2)
export class DAEPass {
	static readonly TagName: string = "pass";
	sid?: string;
	annotate?: DAEAnnotate;
	states?: DAEStates;
	program?: DAEProgram;
	evaluate?: DAEEvaluate;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.annotate = null;
		this.states = null;
		this.program = null;
		this.evaluate = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPass {
		if (el == null) {
			return null;
		}
		var value = new DAEPass();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.annotate = DAEAnnotate.parse(
			DAEUtil.queryChildSelector(el, DAEAnnotate.TagName)
		);
		value.states = DAEStates.parse(
			DAEUtil.queryChildSelector(el, DAEStates.TagName)
		);
		value.program = DAEProgram.parse(
			DAEUtil.queryChildSelector(el, DAEProgram.TagName)
		);
		value.evaluate = DAEEvaluate.parse(
			DAEUtil.queryChildSelector(el, DAEEvaluate.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPass> {
		return DAEUtil.parseArray<DAEPass>(
			this.parse, parent, DAEPass.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPass.TagName);
		return el;
	}
}
