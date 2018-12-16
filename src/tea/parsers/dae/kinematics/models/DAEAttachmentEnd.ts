import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEAttachmentEnd {
	static readonly TagName: string = "attachment_end";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEAttachmentEnd {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAttachmentEnd();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAttachmentEnd.TagName);
		return el;
	}
}
