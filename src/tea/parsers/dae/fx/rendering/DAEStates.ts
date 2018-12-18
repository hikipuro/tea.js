import { DAEUtil } from "../../DAEUtil";

// TODO: fix

// parent: pass (in profile_CG, profile_GLES, profile_GLES2, profile_GLSL)
export class DAEStates {
	static readonly TagName: string = "states";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEStates {
		if (el == null) {
			return null;
		}
		var value = new DAEStates();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStates.TagName);
		return el;
	}
}
