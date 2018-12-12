import { DAEParam } from "./DAEParam";

export class DAEAccessor {
	source: string;
	count: number;
	stride: number;
	params: Array<DAEParam>;

	constructor() {
		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];
	}

	static parse(el: Element): DAEAccessor {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var accessor = new DAEAccessor();
		accessor.source = el.getAttribute("source");
		accessor.count = parseInt(el.getAttribute("count"));
		accessor.stride = parseInt(el.getAttribute("stride"));
		var $params = el.querySelectorAll("param");
		for (var i = 0; i < $params.length; i++) {
			var $param = $params[i];
			var param = DAEParam.parse($param);
			if (param == null) {
				continue;
			}
			accessor.params.push(param);
		}
		return accessor;
	}
}
