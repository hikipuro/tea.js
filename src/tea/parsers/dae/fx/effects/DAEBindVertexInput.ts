import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindVertexInput {
	static readonly TagName: string = "bind_vertex_input";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindVertexInput {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindVertexInput();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindVertexInput.TagName);
		return el;
	}
}
