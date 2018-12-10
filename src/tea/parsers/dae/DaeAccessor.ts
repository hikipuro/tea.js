import { DaeParam } from "./DaeParam";

export class DaeAccessor {
	source: string;
	count: number;
	stride: number;
	params: Array<DaeParam>;

	constructor() {
		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];
	}

	static parse(el: Element): DaeAccessor {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var accessor = new DaeAccessor();
		accessor.source = el.getAttribute("source");
		accessor.count = parseInt(el.getAttribute("count"));
		accessor.stride = parseInt(el.getAttribute("stride"));
		var $params = el.querySelectorAll("param");
		for (var i = 0; i < $params.length; i++) {
			var $param = $params[i];
			var param = DaeParam.parse($param);
			if (param == null) {
				continue;
			}
			accessor.params.push(param);
		}
		return accessor;
	}
}
