import { DAEUtil } from "../../DAEUtil";

// parent: instance_controller
export class DAESkeleton {
	static readonly TagName: string = "skeleton";
	data: string;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAESkeleton {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESkeleton();
		value.data = DAEUtil.textContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESkeleton> {
		return DAEUtil.parseArray<DAESkeleton>(
			this.parse, parent, DAESkeleton.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESkeleton.TagName);
		DAEUtil.setTextContent(el, this.data);
		return el;
	}
}
