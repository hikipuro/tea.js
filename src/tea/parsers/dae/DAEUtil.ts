import { DAESemantic } from "./core/data/DAESemantic";

export class DAEUtil {
	static parseArray<T>(parse: (el: Element) => T, parent: Document | Element, selector: string): Array<T> {
		if (parent == null || selector == null || selector === "") {
			return null;
		}
		selector = ":scope > " + selector;
		var elements = parent.querySelectorAll(selector);
		var length = elements.length;
		if (length <= 0) {
			return null;
		}
		var result: Array<T> = [];
		for (var i = 0; i < length; i++) {
			var el = elements[i];
			var instance = parse(el);
			if (instance == null) {
				continue;
			}
			result.push(instance);
		}
		return result;
	}

	static boolContent(element: Element, selector: string = null): boolean {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = ":scope > " + selector;
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		var value = new Boolean(el.textContent);
		return value.valueOf();
	}

	static intContent(element: Element, selector: string = null): number {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = ":scope > " + selector;
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		return parseInt(el.textContent);
	}

	static floatContent(element: Element, selector: string = null): number {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = ":scope > " + selector;
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		return parseFloat(el.textContent);
	}

	static textContent(element: Element, selector: string = null): string {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = ":scope > " + selector;
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		return el.textContent;
	}

	static boolArray(element: Element): Array<boolean> {
		if (element == null || element.textContent == null) {
			return null;
		}
		var result = [];
		var content = element.textContent.trim();
		var values = content.split(/\s+/);
		var length = values.length;
		for (var i = 0; i < length; i++) {
			var n = new Boolean(values[i]);
			result.push(n.valueOf());
		}
		return result;
	}

	static intArray(element: Element): Array<number> {
		if (element == null || element.textContent == null) {
			return null;
		}
		var result = [];
		var content = element.textContent.trim();
		var numbers = content.split(/\s+/);
		var length = numbers.length;
		for (var i = 0; i < length; i++) {
			var n = parseInt(numbers[i]);
			result.push(n);
		}
		return result;
	}

	static floatArray(element: Element): Array<number> {
		if (element == null || element.textContent == null) {
			return null;
		}
		var result = [];
		var content = element.textContent.trim();
		var values = content.split(/\s+/);
		var length = values.length;
		for (var i = 0; i < length; i++) {
			var n = parseFloat(values[i]);
			result.push(n);
		}
		return result;
	}

	static stringArray(element: Element): Array<string> {
		if (element == null || element.textContent == null) {
			return null;
		}
		var content = element.textContent.trim();
		return content.split(/\s+/);
	}

	static boolAttrib(element: Element, name: string, defaultValue: boolean = null): boolean {
		if (element == null) {
			return defaultValue;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return defaultValue;
		}
		var i = new Boolean(value);
		if (i == null) {
			return defaultValue;
		}
		return i.valueOf();
	}

	static intAttrib(element: Element, name: string, defaultValue: number = null): number {
		if (element == null) {
			return defaultValue;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return defaultValue;
		}
		var i = parseInt(value);
		if (isNaN(i)) {
			return defaultValue;
		}
		return i;
	}

	static floatAttrib(element: Element, name: string, defaultValue: number = null): number {
		if (element == null) {
			return defaultValue;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return defaultValue;
		}
		var i = parseFloat(value);
		if (isNaN(i)) {
			return defaultValue;
		}
		return i;
	}

	static stringAttrib(element: Element, name: string, defaultValue: string = null): string {
		if (element == null) {
			return defaultValue;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return defaultValue;
		}
		return value;
	}

	static semanticAttrib(element: Element, name: string = "semantic"): DAESemantic {
		if (element == null || name == null) {
			return null;
		}
		var attr = element.getAttribute(name);
		return DAESemantic[attr];
	}

	static addTextContent(element: Element, name: string, content: string): void {
		if (element == null || content == null) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = content;
		element.appendChild(el);
	}

	static setAttribute(element: Element, name: string, text: string): void {
		if (element == null || name == null || text == null || text === "") {
			return;
		}
		element.setAttribute(name, text);
	}
	
	static formatDate(date: Date, format: string = "YYYY-MM-DDThh:mm:ss"): string {
		format = format.replace(/YYYY/g, date.getFullYear().toString());
		format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
		format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
		format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
		format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
		format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
		if (format.match(/S/g)) {
			var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
			var length = format.match(/S/g).length;
			for (var i = 0; i < length; i++) {
				format = format.replace(/S/, milliSeconds.substring(i, i + 1));
			}
		}
		return format;
	}
}
