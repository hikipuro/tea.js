import { DAEUtil } from "../../DAEUtil";
import { DAESemanticType } from "./DAESemanticType";

// parent: joints, sampler, targets, vertices, control_vertices
export class DAEUnsharedInput {
	semantic: DAESemanticType;
	source: string;

	constructor() {
		this.semantic = null;
		this.source = null;
	}

	static parse(el: Element): DAEUnsharedInput {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEUnsharedInput();
		value.semantic = DAEUtil.semanticAttrib(el);
		value.source = el.getAttribute("source");
		return value;
	}

	static parseArray(parent: Element): Array<DAEUnsharedInput> {
		return DAEUtil.parseArray<DAEUnsharedInput>(
			this.parse, parent, "input"
		);
	}

	toXML(): Element {
		var el = document.createElement("input");
		var semantic = DAESemanticType.toString(this.semantic);
		DAEUtil.setAttribute(el, "semantic", semantic);
		DAEUtil.setAttribute(el, "source", this.source);
		return el;
	}
}
