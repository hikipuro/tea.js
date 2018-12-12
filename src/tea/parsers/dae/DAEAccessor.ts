import { DAEParam } from "./DAEParam";
import { DAEUtil } from "./DAEUtil";

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
			console.error("parse error");
			return null;
		}
		var accessor = new DAEAccessor();
		accessor.count = DAEUtil.intAttrib(el, "count");
		accessor.offset = DAEUtil.intAttrib(el, "offset", 0);
		accessor.source = el.getAttribute("source");
		accessor.stride = DAEUtil.intAttrib(el, "stride", 1);
		accessor.params = DAEParam.parseArray(el, "param");
		return accessor;
	}
}
