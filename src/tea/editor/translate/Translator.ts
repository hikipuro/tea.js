import _en from "./en.json";
import _ja from "./ja.json";
import _zhCN from "./zh-CN.json";

export class Translator {
	protected static _instance: Translator;
	lang: string;
	basePath: string;
	protected _defaultResource: any;
	protected _resource: any;

	protected constructor() {
		this.lang = "en";
		this.basePath = null;
		this._defaultResource = Translator.en;
		this._resource = {};
	}

	static getInstance(): Translator {
		if (Translator._instance) {
			return Translator._instance;
		}
		Translator._instance = new Translator();
		return Translator._instance;
	}

	loadResource(lang: string): void {
		if (Translator[lang] == null) {
			console.warn("Translator.loadResource(): lang not found '" + lang + "'");
			return;
		}
		this.lang = lang;
		this._resource = Translator[lang];
	}

	getText(path: string): string {
		if (this.basePath) {
			path = this.basePath + "/" + path;
		}
		return this.findText(path);
	}

	protected findText(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		var resource = this._resource;
		var e = path.split("/");
		var length = e.length;
		for (var i = 0; i < length; i++) {
			resource = resource[e[i]];
			if (resource == null) {
				break;
			}
		}
		if (resource) {
			return resource;
		}
		resource = this._defaultResource;
		for (var i = 0; i < length; i++) {
			resource = resource[e[i]];
			if (resource == null) {
				break;
			}
		}
		if (resource) {
			if (typeof resource !== "string") {
				return JSON.stringify(resource);
			}
			return resource;
		}
		return path;
	}
}

export module Translator {
	export var en = _en;
	export var ja = _ja;
	export var zhCN = _zhCN;
}
