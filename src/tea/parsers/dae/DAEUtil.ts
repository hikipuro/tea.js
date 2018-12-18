import { DAESemanticType } from "./core/data/DAESemanticType";

export class DAEUtil {
	static getChildSelector(selector: string): string {
		if (DAEUtil.isNullOrEmpty(selector)) {
			return "";
		}
		return ":scope > " + selector;
	}

	static queryChildSelector(element: Document | Element, selector: string): Element {
		selector = DAEUtil.getChildSelector(selector);
		return element.querySelector(selector);
	}
	
	static parseArray<T>(parse: (el: Element) => T, parent: Document | Element, selector: string): Array<T> {
		if (parse == null
		||  parent == null
		||  DAEUtil.isNullOrEmpty(selector)) {
			return null;
		}
		selector = DAEUtil.getChildSelector(selector);
		var elements = parent.querySelectorAll(selector);
		if (elements == null || elements.length <= 0) {
			return null;
		}
		var length = elements.length;
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

	static getBoolAttr(element: Element, name: string, defaultValue: boolean = null): boolean {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
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

	static getIntAttr(element: Element, name: string, defaultValue: number = null): number {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
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

	static getFloatAttr(element: Element, name: string, defaultValue: number = null): number {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
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

	static getStringAttr(element: Element, name: string, defaultValue: string = null): string {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
			return defaultValue;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return defaultValue;
		}
		return value;
	}

	static getStringArrayAttr(element: Element, name: string): Array<string> {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
			return null;
		}
		var value = element.getAttribute(name);
		if (value == null) {
			return null;
		}
		value = value.trim();
		return value.split(/\s+/);
	}

	static getSemanticAttr(element: Element, name: string = "semantic"): DAESemanticType {
		if (element == null || DAEUtil.isNullOrEmpty(name)) {
			return null;
		}
		var attr = element.getAttribute(name);
		return DAESemanticType[attr];
	}

	static getBoolContent(element: Element, selector: string = null): boolean {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = DAEUtil.getChildSelector(selector);
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		var content = el.textContent;
		if (DAEUtil.isNullOrEmpty(content)) {
			return null;
		}
		var value = new Boolean(content.trim());
		return value.valueOf();
	}

	static getIntContent(element: Element, selector: string = null, defaultValue: number = null): number {
		if (element == null) {
			return defaultValue;
		}
		var el = element;
		if (selector != null) {
			selector = DAEUtil.getChildSelector(selector);
			el = element.querySelector(selector);
		}
		if (el == null) {
			return defaultValue;
		}
		var content = el.textContent;
		if (DAEUtil.isNullOrEmpty(content)) {
			return defaultValue;
		}
		var value = parseInt(content.trim());
		if (DAEUtil.isNullOrNaN(value)) {
			return defaultValue;
		}
		return value;
	}

	static getFloatContent(element: Element, selector: string = null, defaultValue: number = null): number {
		if (element == null) {
			return defaultValue;
		}
		var el = element;
		if (selector != null) {
			selector = DAEUtil.getChildSelector(selector);
			el = element.querySelector(selector);
		}
		if (el == null) {
			return defaultValue;
		}
		var content = el.textContent;
		if (DAEUtil.isNullOrEmpty(content)) {
			return defaultValue;
		}
		var value = parseFloat(content.trim());
		if (DAEUtil.isNullOrNaN(value)) {
			return defaultValue;
		}
		return value;
	}

	static getStringContent(element: Element, selector: string = null, defaultValue: string = null): string {
		if (element == null) {
			return defaultValue;
		}
		var el = element;
		if (selector != null) {
			selector = DAEUtil.getChildSelector(selector);
			el = element.querySelector(selector);
		}
		if (el == null) {
			return defaultValue;
		}
		var content = el.textContent;
		if (DAEUtil.isNullOrEmpty(content)) {
			return defaultValue;
		}
		return content.trim();
	}

	static getBoolArrayContent(element: Element, selector: string = null): Array<boolean> {
		var values = DAEUtil.getStringArrayContent(element, selector);
		if (DAEUtil.isEmptyArray(values)) {
			return null;
		}
		var result = [];
		var length = values.length;
		for (var i = 0; i < length; i++) {
			var n = new Boolean(values[i]);
			if (n == null) {
				continue;
			}
			result.push(n.valueOf());
		}
		return result;
	}

	static getIntArrayContent(element: Element, selector: string = null): Array<number> {
		var values = DAEUtil.getStringArrayContent(element, selector);
		if (DAEUtil.isEmptyArray(values)) {
			return null;
		}
		var result = [];
		var length = values.length;
		for (var i = 0; i < length; i++) {
			var n = parseInt(values[i]);
			if (DAEUtil.isNullOrNaN(n)) {
				continue;
			}
			result.push(n);
		}
		return result;
	}

	static getFloatArrayContent(element: Element, selector: string = null): Array<number> {
		var values = DAEUtil.getStringArrayContent(element, selector);
		if (DAEUtil.isEmptyArray(values)) {
			return null;
		}
		var result = [];
		var length = values.length;
		for (var i = 0; i < length; i++) {
			var n = parseFloat(values[i]);
			if (DAEUtil.isNullOrNaN(n)) {
				continue;
			}
			result.push(n);
		}
		return result;
	}

	static getStringArrayContent(element: Element, selector: string = null): Array<string> {
		if (element == null) {
			return null;
		}
		var el = element;
		if (selector != null) {
			selector = DAEUtil.getChildSelector(selector);
			el = element.querySelector(selector);
		}
		if (el == null) {
			return null;
		}
		var content = el.textContent;
		if (DAEUtil.isNullOrEmpty(content)) {
			return null;
		}
		return content.trim().split(/\s+/);
	}

	static addElement(element: Element, obj: any): void {
		if (element == null || obj == null || obj.toXML == null) {
			return;
		}
		var el = obj.toXML();
		if (el == null) {
			return;
		}
		element.appendChild(el);
	}

	static addElementArray(element: Element, array: Array<any>): void {
		if (element == null || DAEUtil.isEmptyArray(array)) {
			return;
		}
		var length = array.length;
		for (var i = 0; i < length; i++) {
			var item = array[i];
			if (item == null || item.toXML == null) {
				continue;
			}
			var el = item.toXML();
			if (el == null) {
				continue;
			}
			element.appendChild(el);
		}
	}

	static addIntContent(element: Element, name: string, content: number, defaultValue: number = null): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  DAEUtil.isNullOrNaN(content)
		||  content === defaultValue) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = content.toString();
		element.appendChild(el);
	}

	static addFloatContent(element: Element, name: string, content: number, defaultValue: number = null): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  DAEUtil.isNullOrNaN(content)
		||  content === defaultValue) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = content.toString();
		element.appendChild(el);
	}

	static addStringContent(element: Element, name: string, content: string, defaultValue: string = null): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  DAEUtil.isNullOrEmpty(content)
		||  content === defaultValue) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = content;
		element.appendChild(el);
	}

	static addDateContent(element: Element, name: string, content: Date): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  content == null) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = DAEUtil.formatDate(content);
		element.appendChild(el);
	}

	static addStringArrayContent(element: Element, name: string, array: Array<string>): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  DAEUtil.isEmptyArray(array)) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = array.join(" ");
		element.appendChild(el);
	}

	static addArrayContent(element: Element, name: string, array: Array<any>): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  DAEUtil.isEmptyArray(array)) {
			return;
		}
		var el = document.createElement(name);
		el.textContent = array.join(" ");
		element.appendChild(el);
	}

	static setAttr(element: Element, name: string, obj: Object, defaultValue: Object = null): void {
		if (element == null
		||  DAEUtil.isNullOrEmpty(name)
		||  obj == null
		||  obj === defaultValue
		||  obj.toString == null) {
			return;
		}
		element.setAttribute(name, obj.toString());
	}
	
	static setFloatContent(element: Element, content: number): void {
		if (element == null || DAEUtil.isNullOrNaN(content)) {
			return;
		}
		element.textContent = content.toString();
	}

	static setStringContent(element: Element, content: string): void {
		if (element == null || DAEUtil.isNullOrEmpty(content)) {
			return;
		}
		element.textContent = content;
	}

	static setArrayContent(element: Element, array: Array<any>): void {
		if (element == null || DAEUtil.isEmptyArray(array)) {
			return;
		}
		element.textContent = array.join(" ");
	}

	static formatDate(date: Date, format: string = "YYYY-MM-DDThh:mm:ssZ"): string {
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

	protected static isNullOrEmpty(value: string): boolean {
		return value == null || value === "";
	}

	protected static isNullOrNaN(value: number): boolean {
		return value == null || isNaN(value);
	}

	protected static isEmptyArray(value: Array<any>): boolean {
		return value == null || value.length <= 0;
	}
}
