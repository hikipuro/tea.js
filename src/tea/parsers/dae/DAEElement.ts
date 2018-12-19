import { DAEUtil } from "./DAEUtil";
import { DAEAttr } from "./DAEAttr";

export class DAEElement {
	tagName: string;
	attributes: Array<DAEAttr>;
	data: string;

	constructor() {
		this.tagName = null;
		this.attributes = null;
	}

	static parse(el: Element): DAEElement {
		if (el == null) {
			return null;
		}
		var value = new DAEElement();
		value.tagName = el.tagName;
		value.attributes = DAEAttr.parseArray(el);
		value.data = el.textContent;
		return value;
	}

	static parseArray(parent: Element): Array<DAEElement> {
		if (parent == null) {
			return null;
		}
		var elements = parent.children;
		if (elements == null || elements.length <= 0) {
			return null;
		}
		var result = [];
		var length = elements.length;
		for (var i = 0; i < length; i++) {
			var el = elements[i];
			var instance = DAEElement.parse(el);
			if (instance == null) {
				continue;
			}
			result.push(instance);
		}
		return result;
	}

	toXML(): Element {
		var tagName = this.tagName;
		if (tagName == null || tagName === "") {
			return null;
		}
		var el = document.createElement(this.tagName);
		if (this.attributes != null) {
			this.attributes.forEach((attr: DAEAttr) => {
				el.setAttribute(attr.name, attr.value);
			});
		}
		return el;
	}
}
