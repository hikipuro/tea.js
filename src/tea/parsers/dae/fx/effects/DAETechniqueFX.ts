import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETechniqueFX {
	static readonly TagName: string = "technique";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETechniqueFX {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETechniqueFX();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueFX.TagName);
		return el;
	}
}
