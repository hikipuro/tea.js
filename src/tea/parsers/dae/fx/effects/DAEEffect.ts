import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEffect {
	static readonly TagName: string = "effect";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEffect {
		if (el == null) {
			return null;
		}
		var value = new DAEEffect();
		return value;
	}

	static parseArray(parent: Element): Array<DAEEffect> {
		return DAEUtil.parseArray<DAEEffect>(
			this.parse, parent, DAEEffect.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEEffect.TagName);
		return el;
	}
}
