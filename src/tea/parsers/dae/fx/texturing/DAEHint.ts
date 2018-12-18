import { DAEUtil } from "../../DAEUtil";

// parent: format
export class DAEHint {
	static readonly TagName: string = "hint";
	channels: string;
	range: string;
	precision?: string;
	space?: string;

	constructor() {
		this.channels = null;
		this.range = null;
		this.precision = "DEFAULT";
		this.space = null;
	}

	static parse(el: Element): DAEHint {
		if (el == null) {
			return null;
		}
		var value = new DAEHint();
		value.channels = DAEUtil.getStringAttr(el, "channels");
		value.range = DAEUtil.getStringAttr(el, "range");
		value.precision = DAEUtil.getStringAttr(el, "precision", "DEFAULT");
		value.space = DAEUtil.getStringAttr(el, "space");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEHint.TagName);
		DAEUtil.setAttr(el, "channels", this.channels);
		DAEUtil.setAttr(el, "range", this.range);
		DAEUtil.setAttr(el, "precision", this.precision);
		DAEUtil.setAttr(el, "space", this.space);
		return el;
	}
}
