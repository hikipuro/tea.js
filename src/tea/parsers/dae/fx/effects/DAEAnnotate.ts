import { DAEUtil } from "../../DAEUtil";

// parent: effect, technique (FX), pass, newparam
export class DAEAnnotate {
	static readonly TagName: string = "annotate";
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

	static parseArray(parent: Element): Array<DAEAnnotate> {
		return DAEUtil.parseArray<DAEAnnotate>(
			this.parse, parent, DAEAnnotate.TagName
		);
	}
}
