import { DAEUtil } from "../../DAEUtil";
import { DAESizeExact } from "./DAESizeExact";
import { DAESizeRatio } from "./DAESizeRatio";
import { DAEMips } from "./DAEMips";
import { DAEArray } from "../parameters/DAEArray";
import { DAEFormat } from "./DAEFormat";
import { DAEInitFrom } from "./DAEInitFrom";

// TODO: fix unnormalized

// parent: image
export class DAECreate2D {
	static readonly TagName: string = "create_2d";
	sizeExact?: DAESizeExact;
	sizeRatio?: DAESizeRatio;
	mips?: DAEMips;
	//unnormalized?: any;
	array?: DAEArray;
	format?: DAEFormat;
	initFroms?: Array<DAEInitFrom>;

	constructor() {
		this.sizeExact = null;
		this.sizeRatio = null;
		this.mips = null;
		this.array = null;
		this.format = null;
		this.initFroms = null;
	}

	static parse(el: Element): DAECreate2D {
		if (el == null) {
			return null;
		}
		var value = new DAECreate2D();
		value.sizeExact = DAESizeExact.parse(
			DAEUtil.queryChildSelector(el, DAESizeExact.TagName)
		);
		value.sizeRatio = DAESizeRatio.parse(
			DAEUtil.queryChildSelector(el, DAESizeRatio.TagName)
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
		var el = document.createElement(DAECreate2D.TagName);
		DAEUtil.addElement(el, this.sizeExact);
		DAEUtil.addElement(el, this.sizeRatio);
		DAEUtil.addElement(el, this.mips);
		DAEUtil.addElement(el, this.array);
		DAEUtil.addElement(el, this.format);
		DAEUtil.addElementArray(el, this.initFroms);
		return el;
	}
}
