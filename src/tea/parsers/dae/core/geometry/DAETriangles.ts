import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAESemanticType } from "../data/DAESemanticType";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: mesh, convex_mesh
export class DAETriangles implements DAEPrimitiveElement {
	static readonly TagName: string = "triangles";
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

	static parse(el: Element): DAETriangles {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETriangles();
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

	static parseArray(parent: Element): Array<DAETriangles> {
		return DAEUtil.parseArray<DAETriangles>(
			this.parse, parent, DAETriangles.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETriangles.TagName);
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

	findInput(semantic: DAESemanticType): DAESharedInput {
		var inputs = this.inputs;
		if (inputs == null || inputs.length <= 0) {
			return null;
		}
		return inputs.find((input: DAESharedInput): boolean => {
			return input.semantic === semantic;
		});
	}

	toVector3Array(start: number, count: number, stride: number = 1): Array<Tea.Vector3> {
		var data = this.data;
		if (data == null || data.length <= 0) {
			return null;
		}
		var array = [];
		var length = start + count * stride * 3;
		length = Math.min(length, data.length);
		for (var i = start; i < length; i += stride * 3) {
			var x = data[i];
			var y = data[i + stride];
			var z = data[i + stride * 2];
			var v = new Tea.Vector3(x, y, z);
			array.push(v);
		}
		return array;

	}
}
