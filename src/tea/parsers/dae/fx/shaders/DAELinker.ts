import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELinker {
	static readonly TagName: string = "linker";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELinker {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELinker();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELinker.TagName);
		return el;
	}
}
