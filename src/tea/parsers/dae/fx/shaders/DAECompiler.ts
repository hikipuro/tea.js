import { DAEUtil } from "../../DAEUtil";
import { DAEBinary } from "./DAEBinary";

// parent: shader
export class DAECompiler {
	static readonly TagName: string = "compiler";
	platform: string;
	target?: string;
	options?: string;
	binary?: DAEBinary;

	constructor() {
		this.platform = "";
		this.target = null;
		this.options = null;
		this.binary = null;
	}

	static parse(el: Element): DAECompiler {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECompiler();
		value.platform = DAEUtil.getStringAttr(el, "platform");
		value.target = DAEUtil.getStringAttr(el, "target");
		value.options = DAEUtil.getStringAttr(el, "options");
		value.binary = DAEBinary.parse(
			DAEUtil.queryChildSelector(el, DAEBinary.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECompiler.TagName);
		return el;
	}
}
