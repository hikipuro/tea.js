import { DAEUtil } from "../../DAEUtil";
import { DAEValueElement } from "./DAEValueElement";

// parent: effect, technique (FX), pass, newparam
export class DAEAnnotate {
	static readonly TagName: string = "annotate";
	name: string;
	value: DAEValueElement;

	constructor() {
		this.name = null;
		this.value = null;
	}

	static parse(el: Element): DAEAnnotate {
		if (el == null) {
			return null;
		}
		var value = new DAEAnnotate();
		value.name = DAEUtil.getStringAttr(el, "name");
		value.value = null;
		return value;
	}

	static parseArray(parent: Element): Array<DAEAnnotate> {
		return DAEUtil.parseArray<DAEAnnotate>(
			this.parse, parent, DAEAnnotate.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAnnotate.TagName);
		return el;
	}
}
