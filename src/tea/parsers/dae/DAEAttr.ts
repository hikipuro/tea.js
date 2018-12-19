import { DAEUtil } from "./DAEUtil";

export class DAEAttr {
	name: string;
	value: string;

	constructor() {
		this.name = null;
		this.value = null;
	}

	static parse(el: Element): DAEAttr {
		if (el == null) {
			return null;
		}
		var value = new DAEAttr();
		return value;
	}

	static parseArray(el: Element): Array<DAEAttr> {
		if (el == null || el.attributes == null) {
			return null;
		}
		var attributes = el.attributes;
		var length = attributes.length;
		if (length <= 0) {
			return null;
		}
		var result = [];
		for (var i = 0; i < length; i++) {
			var item = attributes.item(i);
			var attr = new DAEAttr();
			attr.name = item.name;
			attr.value = item.value;
			result.push(attr);
		}
		return result;
	}
}
