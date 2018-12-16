import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEStencilTarget {
	static readonly TagName: string = "stencil_target";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEStencilTarget {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEStencilTarget();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEStencilTarget.TagName);
		return el;
	}
}
