import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh
export class DAEPolylist extends DAEPrimitiveElement {
	static readonly TagName: string = "polylist";
	name?: string;
	count: number;
	material: string;
	inputs?: Array<DAESharedInput>;
	vcount?: Array<number>;
	p?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		super();
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.vcount = null;
		this.p = null;
		this.extras = null;
	}

	static parse(el: Element): DAEPolylist {
		if (el == null) {
			return null;
		}
		var value = new DAEPolylist();
		value.name = DAEUtil.getStringAttr(el, "name");
		value.count = DAEUtil.getIntAttr(el, "count");
		value.material = DAEUtil.getStringAttr(el, "material");
		value.inputs = DAESharedInput.parseArray(el);
		value.vcount = DAEUtil.getIntArrayContent(
			DAEUtil.queryChildSelector(el, "vcount")
		);
		value.p = DAEUtil.getIntArrayContent(
			DAEUtil.queryChildSelector(el, "p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolylist> {
		return DAEUtil.parseArray<DAEPolylist>(
			this.parse, parent, DAEPolylist.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPolylist.TagName);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "material", this.material);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addArrayContent(el, "vcount", this.vcount);
		DAEUtil.addArrayContent(el, "p", this.p);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
