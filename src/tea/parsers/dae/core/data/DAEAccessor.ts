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
			return null;
		}
		var value = new DAEAccessor();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.offset = DAEUtil.getIntAttr(el, "offset", 0);
		value.source = DAEUtil.getStringAttr(el, "source");
		value.stride = DAEUtil.getIntAttr(el, "stride", 1);
		value.params = DAEParam.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAccessor.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "offset", this.offset, 0);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.setAttr(el, "stride", this.stride, 1);
		DAEUtil.addElementArray(el, this.params);
		return el;
	}
}
