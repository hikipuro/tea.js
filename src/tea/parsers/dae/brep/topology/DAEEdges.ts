import { DAEUtil } from "../../DAEUtil";
import { DAESharedInput } from "../../core/data/DAESharedInput";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: brep
export class DAEEdges {
	static readonly TagName: string = "edges";
	id: string;
	name?: string;
	count: number;
	inputs: Array<DAESharedInput>;
	p: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = "";
		this.name = null;
		this.count = 0;
		this.inputs = null;
		this.p = null;
		this.extras = null;
	}

	static parse(el: Element): DAEEdges {
		if (el == null) {
			return null;
		}
		var value = new DAEEdges();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.count = DAEUtil.getIntAttr(el, "count");
		value.inputs = DAESharedInput.parseArray(el);
		value.p = DAEUtil.getIntArrayContent(el, "p");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEdges.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addArrayContent(el, "p", this.p);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
