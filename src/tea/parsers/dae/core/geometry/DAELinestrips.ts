import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAELinestrips implements DAEPrimitiveElement {
	static readonly TagName: string = "linestrips";
	name?: string;
	count: number;
	material?: string;
	inputs?: Array<DAESharedInput>;
	data?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.count = 0;
		this.material = null;
		this.inputs = null;
		this.data = null;
		this.extras = null;
	}

	static parse(el: Element): DAELinestrips {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELinestrips();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.inputs = DAESharedInput.parseArray(el);
		value.data = DAEUtil.intArray(
			DAEUtil.queryChildSelector(el, "p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAELinestrips> {
		return DAEUtil.parseArray<DAELinestrips>(
			this.parse, parent, DAELinestrips.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAELinestrips.TagName);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.setAttribute(el, "material", this.material);
		DAEUtil.addXMLArray(el, this.inputs);
		if (this.data != null) {
			var p = document.createElement("p");
			DAEUtil.setArrayContent(p, this.data);
			el.appendChild(p);
		}
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
