import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETechniqueHint {
	static readonly TagName: string = "technique_hint";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETechniqueHint {
		if (el == null) {
			return null;
		}
		var value = new DAETechniqueHint();
		return value;
	}

	static parseArray(parent: Element): Array<DAETechniqueHint> {
		return DAEUtil.parseArray<DAETechniqueHint>(
			this.parse, parent, DAETechniqueHint.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueHint.TagName);
		return el;
	}
}
