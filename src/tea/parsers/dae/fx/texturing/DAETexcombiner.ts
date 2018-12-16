import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETexcombiner {
	static readonly TagName: string = "texcombiner";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETexcombiner {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETexcombiner();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETexcombiner.TagName);
		return el;
	}
}
