import { DAEUtil } from "../../DAEUtil";
import { DAEHint } from "./DAEHint";

// parent: create_2d, create_3d, create_cube
export class DAEFormat {
	static readonly TagName: string = "format";
	hint: DAEHint;
	exact?: string;

	constructor() {
		this.hint = null;
		this.exact = null;
	}

	static parse(el: Element): DAEFormat {
		if (el == null) {
			return null;
		}
		var value = new DAEFormat();
		value.hint = DAEHint.parse(
			DAEUtil.queryChildSelector(el, DAEHint.TagName)
		);
		value.exact = DAEUtil.getStringContent(el, "exact");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFormat.TagName);
		DAEUtil.addElement(el, this.hint);
		DAEUtil.addStringContent(el, "exact", this.exact);
		return el;
	}
}
