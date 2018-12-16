import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFrameOrigin {
	static readonly TagName: string = "frame_origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFrameOrigin {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFrameOrigin();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameOrigin.TagName);
		return el;
	}
}
