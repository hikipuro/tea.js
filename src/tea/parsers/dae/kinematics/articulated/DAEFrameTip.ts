import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFrameTip {
	static readonly TagName: string = "frame_tip";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFrameTip {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFrameTip();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameTip.TagName);
		return el;
	}
}
