import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEEdges {
	static readonly TagName: string = "edges";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEEdges {
		if (el == null) {
			return null;
		}
		var value = new DAEEdges();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEdges.TagName);
		return el;
	}
}
