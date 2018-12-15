import { DAEUtil } from "../../DAEUtil";
import { DAEParam } from "./DAEParam";

// parent: source / technique_common
export class DAEAccessor {
	static readonly TagName: string = "accessor";
	count: number;
	offset?: number;
	source: string;
	stride?: number;
	params: Array<DAEParam>;

	constructor() {
		this.count = 0;
		this.offset = 0;
		this.source = "";
		this.stride = 1;
		this.params = [];
	}

	static parse(el: Element): DAEAccessor {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAccessor();
		value.count = DAEUtil.intAttrib(el, "count");
		value.offset = DAEUtil.intAttrib(el, "offset", 0);
		value.source = DAEUtil.stringAttrib(el, "source");
		value.stride = DAEUtil.intAttrib(el, "stride", 1);
		value.params = DAEParam.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAccessor.TagName);
		DAEUtil.setAttribute(el, "count", this.count);
		if (this.offset !== 0) {
			DAEUtil.setAttribute(el, "offset", this.offset);
		}
		DAEUtil.setAttribute(el, "source", this.source);
		if (this.offset !== 1) {
			DAEUtil.setAttribute(el, "stride", this.stride);
		}
		DAEUtil.addXMLArray(el, this.params);
		return el;
	}
}
