import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEAttachmentStart {
	static readonly TagName: string = "attachment_start";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEAttachmentStart {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAttachmentStart();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAttachmentStart.TagName);
		return el;
	}
}
