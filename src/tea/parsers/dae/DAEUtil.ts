export class DAEUtil {
	static parseArray<T>(parse: (el: Element) => T, element: Element, selector: string): Array<T> {
		if (element == null || selector == null || selector === "") {
			return null;
		}
		var elements = element.querySelectorAll(selector);
		var result: Array<T> = [];
		var length = elements.length;
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

	static textContent(element: Element, selector: string): string {
		if (element == null) {
			return null;
		}
		var el = element.querySelector(selector);
		if (el == null) {
			return null;
		}
		return el.textContent;
	}

	static intArray(element: Element): Array<number> {
		if (element == null || element.textContent == null) {
			return null;
		}
		var result = [];
		var content = element.textContent;
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
		var content = element.textContent;
		var numbers = content.split(/\s+/);
		var length = numbers.length;
		for (var i = 0; i < length; i++) {
			var n = parseFloat(numbers[i]);
			result.push(n);
		}
		return result;
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
}
