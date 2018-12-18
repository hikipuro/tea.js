import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAETrifans implements DAEPrimitiveElement {
	static readonly TagName: string = "trifans";
	name?: string;
	count: number;
	material?: string;
	inputs?: Array<DAESharedInput>;
	data: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.data = [];
		this.extras = null;
	}

	static parse(el: Element): DAETrifans {
		if (el == null) {
			return null;
		}
		var value = new DAETrifans();
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

	static parseArray(parent: Element): Array<DAETrifans> {
		return DAEUtil.parseArray<DAETrifans>(
			this.parse, parent, DAETrifans.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETrifans.TagName);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "material", this.material);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addArrayContent(el, "p", this.data);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
