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
			return null;
		}
		var value = new DAETechniqueFX();
		return value;
	}

	static parseArray(parent: Element): Array<DAETechniqueFX> {
		return DAEUtil.parseArray<DAETechniqueFX>(
			this.parse, parent, DAETechniqueFX.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueFX.TagName);
		return el;
	}
}
