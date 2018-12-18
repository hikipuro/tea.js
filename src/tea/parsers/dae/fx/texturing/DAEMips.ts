import { DAEUtil } from "../../DAEUtil";

// parent: create_2d, create_cube
export class DAEMips {
	static readonly TagName: string = "mips";
	levels: number;
	autoGenerate: boolean;

	constructor() {
		this.levels = null;
		this.autoGenerate = null;
	}

	static parse(el: Element): DAEMips {
		if (el == null) {
			return null;
		}
		var value = new DAEMips();
		value.levels = DAEUtil.getFloatAttr(el, "levels");
		value.autoGenerate = DAEUtil.getBoolAttr(el, "auto_generate");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEMips.TagName);
		DAEUtil.setAttr(el, "levels", this.levels);
		DAEUtil.setAttr(el, "auto_generate", this.autoGenerate);
		return el;
	}
}
