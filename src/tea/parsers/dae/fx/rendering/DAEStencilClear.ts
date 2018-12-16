import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEStencilClear {
	static readonly TagName: string = "stencil_clear";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEStencilClear {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEStencilClear();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStencilClear.TagName);
		return el;
	}
}
