import { DAEUtil } from "../../DAEUtil";
import { DAESize } from "./DAESize";
import { DAEMips } from "./DAEMips";
import { DAEArray } from "../parameters/DAEArray";
import { DAEFormat } from "./DAEFormat";
import { DAEInitFrom } from "./DAEInitFrom";

// parent: image
export class DAECreate3D {
	static readonly TagName: string = "create_3d";
	size: DAESize;
	mips: DAEMips;
	array?: DAEArray;
	format?: DAEFormat;
	initFroms?: Array<DAEInitFrom>;

	constructor() {
		this.size = null;
		this.mips = null;
		this.array = null;
		this.format = null;
		this.initFroms = null;
	}

	static parse(el: Element): DAECreate3D {
		if (el == null) {
			return null;
		}
		var value = new DAECreate3D();
		value.size = DAESize.parse(
			DAEUtil.queryChildSelector(el, DAESize.TagName)
		);
		value.mips = DAEMips.parse(
			DAEUtil.queryChildSelector(el, DAEMips.TagName)
		);
		value.array = DAEArray.parse(
			DAEUtil.queryChildSelector(el, DAEArray.TagName)
		);
		value.format = DAEFormat.parse(
			DAEUtil.queryChildSelector(el, DAEFormat.TagName)
		);
		value.initFroms = DAEInitFrom.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECreate3D.TagName);
		DAEUtil.addElement(el, this.size);
		DAEUtil.addElement(el, this.mips);
		DAEUtil.addElement(el, this.array);
		DAEUtil.addElement(el, this.format);
		DAEUtil.addElementArray(el, this.initFroms);
		return el;
	}
}
