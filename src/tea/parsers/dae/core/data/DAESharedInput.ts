import { DAEUtil } from "../../DAEUtil";
import { DAESemanticType } from "./DAESemanticType";

// parent: lines, linestrips, polygons, polylist, triangles, trifans,
// tristrips, vertex_weights
// (unshared): joints, sampler, targets, vertices, control_vertices
export class DAESharedInput {
	static readonly TagName: string = "input";
	offset: number;
	semantic: DAESemanticType;
	source: string;
	set?: number;

	constructor() {
		this.offset = 0;
		this.semantic = null;
		this.source = null;
		this.set = null;
	}

	static parse(el: Element): DAESharedInput {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESharedInput();
		value.offset = DAEUtil.intAttrib(el, "offset", 0);
		value.semantic = DAEUtil.semanticAttrib(el);
		value.source = DAEUtil.stringAttrib(el, "source");
		value.set = DAEUtil.intAttrib(el, "set");
		return value;
	}

	static parseArray(parent: Element): Array<DAESharedInput> {
		return DAEUtil.parseArray<DAESharedInput>(
			this.parse, parent, DAESharedInput.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESharedInput.TagName);
		DAEUtil.setAttribute(el, "offset", this.offset);
		var semantic = DAESemanticType.toString(this.semantic);
		DAEUtil.setAttribute(el, "semantic", semantic);
		DAEUtil.setAttribute(el, "source", this.source);
		DAEUtil.setAttribute(el, "set", this.set);
		return el;
	}
}
