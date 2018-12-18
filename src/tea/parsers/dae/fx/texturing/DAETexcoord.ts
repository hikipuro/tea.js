import { DAEUtil } from "../../DAEUtil";

// TODO: fix constant

// parent: sampler1D, sampler2D, sampler3D
// samplerCUBE, samplerDEPTH, samplerRECT, samplerStates
export class DAETexcoord {
	static readonly TagName: string = "texcoord";
	semantic: string;

	constructor() {
		this.semantic = null;
	}

	static parse(el: Element): DAETexcoord {
		if (el == null) {
			return null;
		}
		var value = new DAETexcoord();
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		return value;
	}

	static parseArray(parent: Element): Array<DAETexcoord> {
		return DAEUtil.parseArray<DAETexcoord>(
			this.parse, parent, DAETexcoord.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETexcoord.TagName);
		DAEUtil.setAttr(el, "semantic", this.semantic);
		return el;
	}
}
