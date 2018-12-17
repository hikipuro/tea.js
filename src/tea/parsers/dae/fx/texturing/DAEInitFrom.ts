import { DAEUtil } from "../../DAEUtil";
import { DAEHex } from "../shaders/DAEHex";

// parent: image, create_2d, create_3d, create_cube
export class DAEInitFrom {
	static readonly TagName: string = "init_from";
	mipsGenerate?: boolean;
	arrayIndex?: number;
	mipIndex: number;
	depth?: number;
	face?: string;
	ref?: string;
	hex?: DAEHex;

	constructor() {
		this.mipsGenerate = true;
		this.arrayIndex = 0;
		this.mipIndex = 0;
		this.depth = 0;
		this.face = null;
		this.ref = null;
		this.hex = null;
	}

	static parse(el: Element): DAEInitFrom {
		if (el == null) {
			return null;
		}
		var value = new DAEInitFrom();
		value.mipsGenerate = DAEUtil.getBoolAttr(el, "mips_generate", true);
		value.arrayIndex = DAEUtil.getIntAttr(el, "array_index", 0);
		value.mipIndex = DAEUtil.getIntAttr(el, "mip_index", 0);
		value.depth = DAEUtil.getIntAttr(el, "depth", 0);
		value.face = DAEUtil.getStringAttr(el, "face");
		value.ref = DAEUtil.getStringContent(el, "ref");
		value.hex = DAEHex.parse(
			DAEUtil.queryChildSelector(el, "hex")
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInitFrom.TagName);
		return el;
	}
}
