import { DAEUtil } from "../../DAEUtil";

// parent: instance_effect
export class DAETechniqueHint {
	static readonly TagName: string = "technique_hint";
	platform?: string;
	ref: string;
	profile?: string;

	constructor() {
		this.platform = null;
		this.ref = null;
		this.profile = null;
	}

	static parse(el: Element): DAETechniqueHint {
		if (el == null) {
			return null;
		}
		var value = new DAETechniqueHint();
		value.platform = DAEUtil.getStringAttr(el, "platform");
		value.ref = DAEUtil.getStringAttr(el, "ref");
		value.profile = DAEUtil.getStringAttr(el, "profile");
		return value;
	}

	static parseArray(parent: Element): Array<DAETechniqueHint> {
		return DAEUtil.parseArray<DAETechniqueHint>(
			this.parse, parent, DAETechniqueHint.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueHint.TagName);
		DAEUtil.setAttr(el, "platform", this.platform);
		DAEUtil.setAttr(el, "ref", this.ref);
		DAEUtil.setAttr(el, "profile", this.profile);
		return el;
	}
}
