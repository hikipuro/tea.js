import { DAEUtil } from "../../DAEUtil";
import { DAEBinary } from "./DAEBinary";

// parent: program
export class DAELinker {
	static readonly TagName: string = "linker";
	platform: string;
	target?: string;
	options?: string;
	binaries?: Array<DAEBinary>;

	constructor() {
		this.platform = "";
		this.target = null;
		this.options = null;
		this.binaries = null;
	}

	static parse(el: Element): DAELinker {
		if (el == null) {
			return null;
		}
		var value = new DAELinker();
		value.platform = DAEUtil.getStringAttr(el, "platform");
		value.target = DAEUtil.getStringAttr(el, "target");
		value.options = DAEUtil.getStringAttr(el, "options");
		value.binaries = DAEBinary.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAELinker> {
		return DAEUtil.parseArray<DAELinker>(
			this.parse, parent, DAELinker.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAELinker.TagName);
		return el;
	}
}
