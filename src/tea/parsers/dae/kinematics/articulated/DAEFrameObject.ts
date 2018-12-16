import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFrameObject {
	static readonly TagName: string = "frame_object";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFrameObject {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFrameObject();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameObject.TagName);
		return el;
	}
}
