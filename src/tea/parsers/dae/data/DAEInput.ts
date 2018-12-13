import { DAEUtil } from "../DAEUtil";
import { DAESemantic } from "./DAESemantic";

// parent: lines, linestrips, polygons, polylist, triangles, trifans,
// tristrips, vertex_weights
// (unshared): joints, sampler, targets, vertices, control_vertices
export class DAEInput {
	offset: number;
	semantic: DAESemantic;
	source: string;
	set?: number;

	constructor() {
		this.offset = 0;
		this.semantic = null;
		this.source = null;
		this.set = null;
	}

	static parse(el: Element): DAEInput {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInput();
		value.offset = DAEUtil.intAttrib(el, "offset", 0);
		value.semantic = DAEUtil.semanticAttrib(el);
		value.source = el.getAttribute("source");
		value.set = DAEUtil.intAttrib(el, "set");
		return value;
	}

	static parseArray(parent: Element): Array<DAEInput> {
		return DAEUtil.parseArray<DAEInput>(
			this.parse, parent, "input"
		);
	}
}
