import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAELines extends DAEPrimitiveElement {
	static readonly TagName: string = "lines";
	name?: string;
	count: number;
	material?: string;
	inputs?: Array<DAESharedInput>;
	data?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		super();
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.data = null;
		this.extras = null;
	}

	static parse(el: Element): DAELines {
		if (el == null) {
			return null;
		}
		var value = new DAELines();
		value.name = DAEUtil.getStringAttr(el, "name");
		value.count = DAEUtil.getIntAttr(el, "count");
		value.material = DAEUtil.getStringAttr(el, "material");
		value.inputs = DAESharedInput.parseArray(el);
		value.data = DAEUtil.getIntArrayContent(
			DAEUtil.queryChildSelector(el, "p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAELines> {
		return DAEUtil.parseArray<DAELines>(
			this.parse, parent, DAELines.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAELines.TagName);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "material", this.material);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addArrayContent(el, "p", this.data);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
