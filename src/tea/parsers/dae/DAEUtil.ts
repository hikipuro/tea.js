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
