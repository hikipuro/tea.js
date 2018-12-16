import { DAEUtil } from "../../DAEUtil";
import { DAERef } from "./DAERef";
import { DAEHex } from "./DAEHex";

// parent: compiler, linker
export class DAEBinary {
	static readonly TagName: string = "binary";
	ref: DAERef;
	hex: DAEHex;

	constructor() {
		this.ref = null;
		this.hex = null;
	}

	static parse(el: Element): DAEBinary {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBinary();
		value.ref = DAERef.parse(
			DAEUtil.queryChildSelector(el, "ref")
		);
		value.hex = DAEHex.parse(
			DAEUtil.queryChildSelector(el, "hex")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBinary.TagName);
		return el;
	}
}
