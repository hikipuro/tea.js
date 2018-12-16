import { DAEUtil } from "../../DAEUtil";

// parent: animation
export class DAEChannel {
	static readonly TagName: string = "channel";
	source: string;
	target: string;

	constructor() {
		this.source = "";
		this.target = "";
	}

	static parse(el: Element): DAEChannel {
		if (el == null) {
			return null;
		}
		var value = new DAEChannel();
		value.source = DAEUtil.getStringAttr(el, "source", "");
		value.target = DAEUtil.getStringAttr(el, "target", "");
		return value;
	}
	
	static parseArray(parent: Element): Array<DAEChannel> {
		return DAEUtil.parseArray<DAEChannel>(
			this.parse, parent, DAEChannel.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEChannel.TagName);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.setAttr(el, "target", this.target);
		return el;
	}
}
