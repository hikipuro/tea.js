import { DAEParam } from "./DAEParam";
import { DAEUtil } from "../DAEUtil";

// parent: source / technique_common
export class DAEAccessor {
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
}
