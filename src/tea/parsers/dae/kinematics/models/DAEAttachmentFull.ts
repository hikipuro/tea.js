import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEAttachmentFull {
	static readonly TagName: string = "attachment_full";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEAttachmentFull {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAttachmentFull();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEAttachmentFull.TagName);
		return el;
	}
}
