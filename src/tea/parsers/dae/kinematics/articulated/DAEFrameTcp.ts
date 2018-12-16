import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFrameTcp {
	static readonly TagName: string = "frame_tcp";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFrameTcp {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFrameTcp();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFrameTcp.TagName);
		return el;
	}
}
