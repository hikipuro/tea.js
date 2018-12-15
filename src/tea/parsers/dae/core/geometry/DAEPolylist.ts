import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh
export class DAEPolylist implements DAEPrimitiveElement {
	name?: string;
	count: number;
	material: string;
	inputs?: Array<DAESharedInput>;
	vcount?: Array<number>;
	p?: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEPolylist();
		value.name = DAEUtil.stringAttrib(el, "name");
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.inputs = DAESharedInput.parseArray(el);
		value.vcount = DAEUtil.intArray(
			el.querySelector(":scope > vcount")
		);
		value.p = DAEUtil.intArray(
			el.querySelector(":scope > p")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolylist> {
		return DAEUtil.parseArray<DAEPolylist>(
			this.parse, parent, "polylist"
		);
	}

	toXML(): Element {
		var el = document.createElement("polylist");
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "count", this.count);
		DAEUtil.setAttribute(el, "material", this.material);
		DAEUtil.addXMLArray(el, this.inputs);
		if (this.vcount != null) {
			var vcount = document.createElement("vcount");
			DAEUtil.setArrayContent(vcount, this.vcount);
			el.appendChild(vcount);
		}
		if (this.p != null) {
			var p = document.createElement("p");
			DAEUtil.setArrayContent(p, this.p);
			el.appendChild(p);
		}
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
