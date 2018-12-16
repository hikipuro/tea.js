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
			return null;
		}
		var value = new DAESkeleton();
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAESkeleton> {
		return DAEUtil.parseArray<DAESkeleton>(
			this.parse, parent, DAESkeleton.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESkeleton.TagName);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
