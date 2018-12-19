import { DAEUtil } from "../../DAEUtil";
import { DAESemanticType } from "./DAESemanticType";

// parent:
// core: lines, linestrips, polygons, polylist, triangles, trifans,
// tristrips, vertex_weights
// brep: edges, faces, pcurves, shells, solids, wires
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
			return null;
		}
		var value = new DAESharedInput();
		value.offset = DAEUtil.getIntAttr(el, "offset", 0);
		value.semantic = DAEUtil.getSemanticAttr(el);
		value.source = DAEUtil.getStringAttr(el, "source");
		value.set = DAEUtil.getIntAttr(el, "set");
		return value;
	}

	static parseArray(parent: Element): Array<DAESharedInput> {
		return DAEUtil.parseArray<DAESharedInput>(
			this.parse, parent, DAESharedInput.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESharedInput.TagName);
		DAEUtil.setAttr(el, "offset", this.offset);
		var semantic = DAESemanticType.toString(this.semantic);
		DAEUtil.setAttr(el, "semantic", semantic);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.setAttr(el, "set", this.set);
		return el;
	}
}
