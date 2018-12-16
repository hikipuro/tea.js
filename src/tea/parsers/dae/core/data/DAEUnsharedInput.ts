import { DAEUtil } from "../../DAEUtil";
import { DAESemanticType } from "./DAESemanticType";

// parent: joints, sampler, targets, vertices, control_vertices
export class DAEUnsharedInput {
	static readonly TagName: string = "input";
	semantic: DAESemanticType;
	source: string;

	constructor() {
		this.semantic = null;
		this.source = null;
	}

	static parse(el: Element): DAEUnsharedInput {
		if (el == null) {
			return null;
		}
		var value = new DAEUnsharedInput();
		value.semantic = DAEUtil.getSemanticAttr(el);
		value.source = DAEUtil.getStringAttr(el, "source");
		return value;
	}

	static parseArray(parent: Element): Array<DAEUnsharedInput> {
		return DAEUtil.parseArray<DAEUnsharedInput>(
			this.parse, parent, DAEUnsharedInput.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEUnsharedInput.TagName);
		var semantic = DAESemanticType.toString(this.semantic);
		DAEUtil.setAttr(el, "semantic", semantic);
		DAEUtil.setAttr(el, "source", this.source);
		return el;
	}
}
