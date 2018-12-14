import { DAEUtil } from "../../DAEUtil";

// parent: effect, technique (FX), pass, newparam
export class DAEAnnotate {
	name: string;
	value: any;

	constructor() {
		this.name = null;
		this.value = null;
	}

	static parse(el: Element): DAEAnnotate {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAnnotate();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.value = null;
		return value;
	}
}
